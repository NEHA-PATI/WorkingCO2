import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./basic-ui";
import {
  FaPlus,
  FaUpload,
  FaFileAlt,
  FaPaperPlane,
  FaCalculator,
  FaCheck,
} from "react-icons/fa";

// Icon components with colors
const PlusIcon = () => <FaPlus size={24} style={{ color: "#3b82f6" }} />;
const UploadIcon = () => <FaUpload size={24} style={{ color: "#10b981" }} />;
const FileTextIcon = () => <FaFileAlt size={24} style={{ color: "#8b5cf6" }} />;
const SendIcon = () => <FaPaperPlane size={24} style={{ color: "#f97316" }} />;
const CalculatorIcon = () => <FaCalculator size={24} style={{ color: "#6366f1" }} />;
const CheckIcon = () => <FaCheck size={24} style={{ color: "#10b981" }} />;

const QuickActions = () => {
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const quickActions = [
    {
      title: "Add New Asset",
      description: "Register a new carbon reduction asset",
      icon: PlusIcon,
      bgColor: "#dbeafe",
      iconColor: "#3b82f6",
      onClick: () => setShowAddAsset(true),
    },
    {
      title: "Upload Documents",
      description: "Submit verification documents",
      icon: UploadIcon,
      bgColor: "#d1fae5",
      iconColor: "#10b981",
      onClick: () => {},
    },
    {
      title: "Generate Report",
      description: "Create compliance or progress report",
      icon: FileTextIcon,
      bgColor: "#ede9fe",
      iconColor: "#8b5cf6",
      onClick: () => setShowReport(true),
    },
    {
      title: "Submit Credits",
      description: "Submit carbon credits for verification",
      icon: SendIcon,
      bgColor: "#fed7aa",
      iconColor: "#f97316",
      onClick: () => {},
    },
    {
      title: "Calculate Emissions",
      description: "Use our carbon footprint calculator",
      icon: CalculatorIcon,
      bgColor: "#e0e7ff",
      iconColor: "#6366f1",
      onClick: () => {},
    },
    {
      title: "Verify Asset",
      description: "Mark asset verification as complete",
      icon: CheckIcon,
      bgColor: "#d1fae5",
      iconColor: "#10b981",
      onClick: () => {},
    },
  ];

  const recentActions = [
    {
      action: "Added Solar Panel Array SP-045",
      time: "2 hours ago",
      status: "completed",
    },
    {
      action: "Uploaded verification documents",
      time: "5 hours ago",
      status: "pending",
    },
    {
      action: "Generated monthly report",
      time: "1 day ago",
      status: "completed",
    },
    {
      action: "Submitted 150 carbon credits",
      time: "2 days ago",
      status: "in-review",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "in-review":
        return "badge-info";
      default:
        return "badge-default";
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts for faster workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid-6 md-grid-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover-card"
                    onClick={action.onClick}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mb-3">
                        <Icon style={{ color: action.iconColor }} />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-secondary">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Actions</CardTitle>
          <CardDescription>
            Your recent activity and submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActions.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div>
                  <div className="font-medium">{item.action}</div>
                  <div className="text-sm text-secondary">{item.time}</div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.replace("-", " ")}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Asset Modal */}
      <Dialog open={showAddAsset} onOpenChange={setShowAddAsset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Asset Name
              </label>
              <Input placeholder="Enter asset name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Asset Type
              </label>
              <select className="select w-full">
                <option>Solar Panel</option>
                <option>Wind Turbine</option>
                <option>Electric Vehicle</option>
                <option>Carbon Capture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input placeholder="Enter location" />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button className="button-primary flex-1">Add Asset</Button>
              <Button
                className="button-ghost flex-1"
                onClick={() => setShowAddAsset(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Report Modal */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Report Type
              </label>
              <select className="select w-full">
                <option>Monthly Progress Report</option>
                <option>Compliance Report</option>
                <option>Carbon Credit Summary</option>
                <option>Asset Performance Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date Range
              </label>
              <div className="grid-2 gap-2">
                <Input type="date" />
                <Input type="date" />
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button className="button-primary flex-1">Generate Report</Button>
              <Button
                className="button-ghost flex-1"
                onClick={() => setShowReport(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default QuickActions;
