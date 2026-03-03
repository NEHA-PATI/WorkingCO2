import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import {
  learnMoreSectionsByContext,
  toSectionId,
} from "@features/user/config/learnMoreContent";
import "@features/user/styles/LearnMore.css";

const LearnMore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const context =
    searchParams.get("context") === "organisation" ? "organisation" : "user";
  const sectionParam = toSectionId(searchParams.get("section") || "");
  const fromPath = searchParams.get("from");

  const sections = useMemo(
    () => learnMoreSectionsByContext[context] || learnMoreSectionsByContext.user,
    [context],
  );

  const [activeSectionId, setActiveSectionId] = useState("");

  useEffect(() => {
    const matched = sections.find((section) => section.id === sectionParam);
    setActiveSectionId(matched?.id || sections[0]?.id || "");
  }, [sectionParam, sections]);

  const activeSection = useMemo(() => {
    if (!activeSectionId) return null;
    return sections.find((section) => section.id === activeSectionId) || null;
  }, [activeSectionId, sections]);

  useEffect(() => {
    if (!activeSection?.id) return;

    const target = document.getElementById(activeSection.id);
    if (!target) return;

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [activeSection]);

  const handleClose = () => {
    if (fromPath) {
      navigate(fromPath);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <div className="lm-root">
      <div className="lm-container">
        <header className="lm-header">
          <h1 className="lm-title">
            {activeSection ? activeSection.title : "Learn More"}
          </h1>
          <p className="lm-subtitle">
            Explore complete details for the selected service.
          </p>
        </header>

        <section className="lm-sections">
          <div className="lm-layout">
            <nav className="lm-tabs" aria-label="Service tabs">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`lm-tab-btn ${activeSection?.id === section.id ? "is-active" : ""}`}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  {section.title}
                </button>
              ))}
            </nav>

            {activeSection && (
              <article
                id={activeSection.id}
                className="lm-section-card is-active"
              >
                <button
                  type="button"
                  className="lm-close-btn"
                  onClick={handleClose}
                  aria-label="Close learn more page"
                >
                  <FaXmark />
                </button>

                <div className="lm-content-block">
                  <h2 className="lm-block-title">Summary</h2>
                  <p className="lm-section-text">{activeSection.summary}</p>
                </div>

                <div className="lm-content-block">
                  <h2 className="lm-block-title">Detailed Description</h2>
                  <p className="lm-section-text">{activeSection.detail}</p>
                </div>

                <div className="lm-content-block">
                  <h2 className="lm-block-title">Highlights</h2>
                  <ul className="lm-highlights">
                    {activeSection.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnMore;
