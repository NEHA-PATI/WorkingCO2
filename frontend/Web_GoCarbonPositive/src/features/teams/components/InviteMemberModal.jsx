'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaX } from 'react-icons/fa6';
import '@features/teams/styles/Team.css';

export default function InviteMemberModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'editor',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role,
            status: 'pending',
            joinedDate: new Date().toLocaleDateString(),
        });

        setFormData({ email: '', firstName: '', lastName: '', role: 'editor' });
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="teams-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="teams-modal-content"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="teams-modal-header">
                    <h2 className="teams-modal-title">Invite Team Member</h2>
                    <motion.button
                        className="teams-modal-close"
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaX size={18} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="teams-modal-form">
                    <div className="teams-form-group">
                        <label htmlFor="email" className="teams-form-label">
                            Email Address <span className="teams-required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="member@example.com"
                            className={`teams-form-input ${errors.email ? 'teams-form-input--error' : ''}`}
                        />
                        {errors.email && (
                            <p className="teams-form-error">{errors.email}</p>
                        )}
                    </div>

                    <div className="teams-form-row">
                        <div className="teams-form-group">
                            <label htmlFor="firstName" className="teams-form-label">
                                First Name <span className="teams-required">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                className={`teams-form-input ${errors.firstName ? 'teams-form-input--error' : ''}`}
                            />
                            {errors.firstName && (
                                <p className="teams-form-error">{errors.firstName}</p>
                            )}
                        </div>

                        <div className="teams-form-group">
                            <label htmlFor="lastName" className="teams-form-label">
                                Last Name <span className="teams-required">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className={`teams-form-input ${errors.lastName ? 'teams-form-input--error' : ''}`}
                            />
                            {errors.lastName && (
                                <p className="teams-form-error">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div className="teams-form-group">
                        <label htmlFor="role" className="teams-form-label">
                            Role <span className="teams-required">*</span>
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="teams-form-select"
                        >
                            <option value="viewer">Viewer - View only access</option>
                            <option value="editor">Editor - Create and edit content</option>
                            <option value="manager">Manager - Full administrative access</option>
                        </select>
                    </div>

                    <div className="teams-modal-footer">
                        <motion.button
                            type="button"
                            className="teams-modal-btn teams-modal-btn--secondary"
                            onClick={onClose}
                            whileHover={{ backgroundColor: '#e5e7eb' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="teams-modal-btn teams-modal-btn--primary"
                            whileHover={{ backgroundColor: '#2563eb', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Send Invite
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
