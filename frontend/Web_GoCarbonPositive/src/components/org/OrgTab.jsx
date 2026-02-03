'use client';

import React, { useState } from 'react';
import {
    FaChartBar,
    FaCoins,
    FaShieldAlt,
    FaUsers,
    FaRocket,
    FaEye,
} from 'react-icons/fa';
import '../../styles/org/OrgTab.css';

/**
 * OrgTab
 * - Pure UI component
 * - Controlled by parent
 * - No internal state
 */
const OrgTab = ({ isVisible = true, onTabChange }) => {
    const [activeTab, setActiveTab] = useState('earnings');

    if (!isVisible) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FaEye, color: '#95b5ea' },
        { id: 'assets', label: 'Assets', icon: FaChartBar, color: '#96f8d7' },
        { id: 'earnings', label: 'Earnings', icon: FaCoins, color: '#ffd998' },
        { id: 'compliance', label: 'Compliance', icon: FaShieldAlt, color: '#deb3b3' },
        { id: 'team', label: 'Team', icon: FaUsers, color: '#c9bce8' },
        { id: 'actions', label: 'Quick Actions', icon: FaRocket, color: '#bbe7ef' },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    return (
        <nav className="org-tab-nav">
            <div className="org-tab-nav-content">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`org-tab-nav-item ${activeTab === tab.id ? 'org-tab-nav-active' : ''
                                }`}
                            onClick={() => handleTabChange(tab.id)}
                            style={{ '--tab-color': tab.color }}
                        >
                            <Icon className="org-tab-nav-icon" />
                            <span className="org-tab-nav-label">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            <div className={`org-tab-nav-underline org-tab-underline-${activeTab}`} />
        </nav>
    );
};

export default OrgTab;
