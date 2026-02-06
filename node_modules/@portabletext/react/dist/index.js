import { Fragment, jsx } from "react/jsx-runtime";
import { LIST_NEST_MODE_HTML, buildMarksTree, isPortableTextBlock, isPortableTextListItemBlock, isPortableTextToolkitList, isPortableTextToolkitSpan, isPortableTextToolkitTextNode, nestLists, spanToPlainText, toPlainText } from "@portabletext/toolkit";
import { useMemo } from "react";
const defaultLists = {
	number: ({ children }) => /* @__PURE__ */ jsx("ol", { children }),
	bullet: ({ children }) => /* @__PURE__ */ jsx("ul", { children })
}, DefaultListItem = ({ children }) => /* @__PURE__ */ jsx("li", { children }), link = ({ children, value }) => /* @__PURE__ */ jsx("a", {
	href: value?.href,
	children
}), underlineStyle = { textDecoration: "underline" }, defaultMarks = {
	em: ({ children }) => /* @__PURE__ */ jsx("em", { children }),
	strong: ({ children }) => /* @__PURE__ */ jsx("strong", { children }),
	code: ({ children }) => /* @__PURE__ */ jsx("code", { children }),
	underline: ({ children }) => /* @__PURE__ */ jsx("span", {
		style: underlineStyle,
		children
	}),
	"strike-through": ({ children }) => /* @__PURE__ */ jsx("del", { children }),
	link
}, getTemplate = (type, prop) => `[@portabletext/react] Unknown ${type}, specify a component for it in the \`components.${prop}\` prop`, unknownTypeWarning = (typeName) => getTemplate(`block type "${typeName}"`, "types"), unknownMarkWarning = (markType) => getTemplate(`mark type "${markType}"`, "marks"), unknownBlockStyleWarning = (blockStyle) => getTemplate(`block style "${blockStyle}"`, "block"), unknownListStyleWarning = (listStyle) => getTemplate(`list style "${listStyle}"`, "list"), unknownListItemStyleWarning = (listStyle) => getTemplate(`list item style "${listStyle}"`, "listItem");
function printWarning(message) {
	console.warn(message);
}
const hidden = { display: "none" }, defaultComponents = {
	types: {},
	block: {
		normal: ({ children }) => /* @__PURE__ */ jsx("p", { children }),
		blockquote: ({ children }) => /* @__PURE__ */ jsx("blockquote", { children }),
		h1: ({ children }) => /* @__PURE__ */ jsx("h1", { children }),
		h2: ({ children }) => /* @__PURE__ */ jsx("h2", { children }),
		h3: ({ children }) => /* @__PURE__ */ jsx("h3", { children }),
		h4: ({ children }) => /* @__PURE__ */ jsx("h4", { children }),
		h5: ({ children }) => /* @__PURE__ */ jsx("h5", { children }),
		h6: ({ children }) => /* @__PURE__ */ jsx("h6", { children })
	},
	marks: defaultMarks,
	list: defaultLists,
	listItem: DefaultListItem,
	hardBreak: () => /* @__PURE__ */ jsx("br", {}),
	unknownType: ({ value, isInline }) => {
		let warning = unknownTypeWarning(value._type);
		return jsx(isInline ? "span" : "div", {
			style: hidden,
			children: warning
		});
	},
	unknownMark: ({ markType, children }) => /* @__PURE__ */ jsx("span", {
		className: `unknown__pt__mark__${markType}`,
		children
	}),
	unknownList: ({ children }) => /* @__PURE__ */ jsx("ul", { children }),
	unknownListItem: ({ children }) => /* @__PURE__ */ jsx("li", { children }),
	unknownBlockStyle: ({ children }) => /* @__PURE__ */ jsx("p", { children })
};
function mergeComponents(parent, overrides) {
	let { block: _block, list: _list, listItem: _listItem, marks: _marks, types: _types, ...rest } = overrides;
	return {
		...parent,
		block: mergeDeeply(parent, overrides, "block"),
		list: mergeDeeply(parent, overrides, "list"),
		listItem: mergeDeeply(parent, overrides, "listItem"),
		marks: mergeDeeply(parent, overrides, "marks"),
		types: mergeDeeply(parent, overrides, "types"),
		...rest
	};
}
function mergeDeeply(parent, overrides, key) {
	let override = overrides[key], parentVal = parent[key];
	return typeof override == "function" || override && typeof parentVal == "function" ? override : override ? {
		...parentVal,
		...override
	} : parentVal;
}
function PortableText({ value: input, components: componentOverrides, listNestingMode, onMissingComponent: missingComponentHandler = printWarning }) {
	let handleMissingComponent = missingComponentHandler || noop, nested = nestLists(Array.isArray(input) ? input : [input], listNestingMode || LIST_NEST_MODE_HTML), components = useMemo(() => componentOverrides ? mergeComponents(defaultComponents, componentOverrides) : defaultComponents, [componentOverrides]), renderNode = useMemo(() => getNodeRenderer(components, handleMissingComponent), [components, handleMissingComponent]);
	return /* @__PURE__ */ jsx(Fragment, { children: nested.map((node, index) => renderNode({
		node,
		index,
		isInline: !1,
		renderNode
	})) });
}
const getNodeRenderer = (components, handleMissingComponent) => {
	function renderNode(options) {
		let { node, index, isInline } = options, key = node._key || `node-${index}`;
		return isPortableTextToolkitList(node) ? renderList(node, index, key) : isPortableTextListItemBlock(node) ? renderListItem(node, index, key) : isPortableTextToolkitSpan(node) ? renderSpan(node, index, key) : hasCustomComponentForNode(node) ? renderCustomBlock(node, index, key, isInline) : isPortableTextBlock(node) ? renderBlock(node, index, key, isInline) : isPortableTextToolkitTextNode(node) ? renderText(node, key) : renderUnknownType(node, index, key, isInline);
	}
	function hasCustomComponentForNode(node) {
		return node._type in components.types;
	}
	function renderListItem(node, index, key) {
		let tree = serializeBlock({
			node,
			index,
			isInline: !1,
			renderNode
		}), renderer = components.listItem, Li = (typeof renderer == "function" ? renderer : renderer[node.listItem]) || components.unknownListItem;
		if (Li === components.unknownListItem) {
			let style = node.listItem || "bullet";
			handleMissingComponent(unknownListItemStyleWarning(style), {
				type: style,
				nodeType: "listItemStyle"
			});
		}
		let children = tree.children;
		if (node.style && node.style !== "normal") {
			let { listItem: _listItem, ...blockNode } = node;
			children = renderNode({
				node: blockNode,
				index,
				isInline: !1,
				renderNode
			});
		}
		return /* @__PURE__ */ jsx(Li, {
			value: node,
			index,
			isInline: !1,
			renderNode,
			children
		}, key);
	}
	function renderList(node, index, key) {
		let children = node.children.map((child, childIndex) => renderNode({
			node: child._key ? child : {
				...child,
				_key: `li-${index}-${childIndex}`
			},
			index: childIndex,
			isInline: !1,
			renderNode
		})), component = components.list, List = (typeof component == "function" ? component : component[node.listItem]) || components.unknownList;
		if (List === components.unknownList) {
			let style = node.listItem || "bullet";
			handleMissingComponent(unknownListStyleWarning(style), {
				nodeType: "listStyle",
				type: style
			});
		}
		return /* @__PURE__ */ jsx(List, {
			value: node,
			index,
			isInline: !1,
			renderNode,
			children
		}, key);
	}
	function renderSpan(node, _index, key) {
		let { markDef, markType, markKey } = node, Span = components.marks[markType] || components.unknownMark, children = node.children.map((child, childIndex) => renderNode({
			node: child,
			index: childIndex,
			isInline: !0,
			renderNode
		}));
		return Span === components.unknownMark && handleMissingComponent(unknownMarkWarning(markType), {
			nodeType: "mark",
			type: markType
		}), /* @__PURE__ */ jsx(Span, {
			text: spanToPlainText(node),
			value: markDef,
			markType,
			markKey,
			renderNode,
			children
		}, key);
	}
	function renderBlock(node, index, key, isInline) {
		let { _key, ...props } = serializeBlock({
			node,
			index,
			isInline,
			renderNode
		}), style = props.node.style || "normal", Block = (typeof components.block == "function" ? components.block : components.block[style]) || components.unknownBlockStyle;
		return Block === components.unknownBlockStyle && handleMissingComponent(unknownBlockStyleWarning(style), {
			nodeType: "blockStyle",
			type: style
		}), /* @__PURE__ */ jsx(Block, {
			...props,
			value: props.node,
			renderNode
		}, key);
	}
	function renderText(node, key) {
		if (node.text === "\n") {
			let HardBreak = components.hardBreak;
			return HardBreak ? /* @__PURE__ */ jsx(HardBreak, {}, key) : "\n";
		}
		return node.text;
	}
	function renderUnknownType(node, index, key, isInline) {
		let nodeOptions = {
			value: node,
			isInline,
			index,
			renderNode
		};
		handleMissingComponent(unknownTypeWarning(node._type), {
			nodeType: "block",
			type: node._type
		});
		let UnknownType = components.unknownType;
		return /* @__PURE__ */ jsx(UnknownType, { ...nodeOptions }, key);
	}
	function renderCustomBlock(node, index, key, isInline) {
		let nodeOptions = {
			value: node,
			isInline,
			index,
			renderNode
		}, Node = components.types[node._type];
		return Node ? /* @__PURE__ */ jsx(Node, { ...nodeOptions }, key) : null;
	}
	return renderNode;
};
function serializeBlock(options) {
	let { node, index, isInline, renderNode } = options, children = buildMarksTree(node).map((child, i) => renderNode({
		node: child,
		isInline: !0,
		index: i,
		renderNode
	}));
	return {
		_key: node._key || `block-${index}`,
		children,
		index,
		isInline,
		node
	};
}
function noop() {}
export { PortableText, defaultComponents, mergeComponents, toPlainText };

//# sourceMappingURL=index.js.map