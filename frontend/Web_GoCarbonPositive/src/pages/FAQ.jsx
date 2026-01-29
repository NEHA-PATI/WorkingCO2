'use client';

import React, { useState, useRef, useEffect } from 'react';

const FAQPage = () => {
  const [openId, setOpenId] = useState(null);
  const faqRef = useRef(null);

  const faqs = [
    {
      id: 1,
      question: "How to earn credits?",
      answer: "You can earn green credits by logging EV trips, planting trees, installing solar panels, and generating solar energy. Each eco-friendly action contributes specific credit points to your account, helping you build a sustainable lifestyle while earning rewards."
    },
    {
      id: 2,
      question: "How to redeem credits?",
      answer: "Redeem your earned credits through our marketplace for exclusive eco-friendly products, services, or donations to environmental causes. You can browse available rewards, check credit requirements, and instantly apply your credits toward purchases with just a few clicks."
    },
    {
      id: 3,
      question: "What are green credits?",
      answer: "Green credits are digital tokens that represent your positive environmental impact. They're earned through sustainable actions and can be redeemed for rewards. Each credit equals a measurable amount of carbon offset or environmental contribution to our planet."
    },
    {
      id: 4,
      question: "How do I track my solar energy?",
      answer: "Connect your solar panel system to our platform using our app or web dashboard. Real-time monitoring displays your daily, monthly, and yearly energy generation, carbon offset, and earned credits. View detailed analytics and environmental impact reports anytime."
    },
    {
      id: 5,
      question: "How does the carbon offset work?",
      answer: "Your activities—like EV usage, tree planting, and solar energy generation—are converted into carbon offset metrics. We calculate the environmental impact and issue equivalent green credits. Track your total carbon footprint reduction through our transparent impact dashboard."
    },
    {
      id: 6,
      question: "Can I share my achievements with others?",
      answer: "Yes! Share your sustainability milestones on social media directly from your profile. Invite friends and family to join the movement, create community challenges, and inspire others to adopt eco-friendly practices while earning rewards together."
    },
    {
      id: 7,
      question: "What happens to my data?",
      answer: "Your privacy is our priority. All data is encrypted and securely stored. We never sell your information to third parties. You maintain full control over your profile and can adjust privacy settings anytime. Learn more in our detailed privacy policy."
    },
    // {
    //   id: 8,
    //   question: "Is there a mobile app?",
    //   answer: "Yes! Our mobile app is available on iOS and Android, offering the full platform experience on the go. Track credits, log activities, view achievements, and manage your account seamlessly from your smartphone with push notifications for milestone celebrations."
    // }
  ];

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (faqRef.current && !faqRef.current.contains(event.target)) {
        setOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="cp-faq-container">
      <style>{`
        .cp-faq-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0f9ff 100%);
          padding: 60px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .cp-faq-wrapper {
          max-width: 900px;
          margin: 0 auto;
        }

        .cp-faq-title {
          font-size: 42px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 50px;
          text-align: left;
          letter-spacing: -0.5px;
        }

        .cp-faq-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .cp-faq-item {
          margin-bottom: 16px;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          background-color: #ffffff;
          border: 2px solid #e0f2e9;
        }

        .cp-faq-item.cp-faq-open {
          border: 2px solid #10b981;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);
        }

        .cp-faq-question-btn {
          width: 100%;
          padding: 22px 28px;
          background-color: #ffffff;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: left;
          position: relative;
        }

        .cp-faq-item.cp-faq-open .cp-faq-question-btn {
          background-color: #f0fdf4;
        }

        .cp-faq-question-btn:hover:not(.cp-faq-open .cp-faq-question-btn) {
          background-color: #f9fafb;
        }

        .cp-faq-icon {
          font-size: 24px;
          font-weight: 300;
          color: #10b981;
          transition: transform 0.3s ease;
          flex-shrink: 0;
          margin-left: 20px;
        }

        .cp-faq-item.cp-faq-open .cp-faq-icon {
          transform: rotate(45deg);
        }

        .cp-faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          background-color: #f0fdf4;
          padding: 0 28px;
        }

        .cp-faq-item.cp-faq-open .cp-faq-answer {
          max-height: 500px;
          padding: 24px 28px;
        }

        .cp-faq-answer-text {
          color: #4b5563;
          font-size: 15px;
          line-height: 1.6;
          font-weight: 400;
          margin: 0;
        }

        @media (max-width: 640px) {
          .cp-faq-container {
            padding: 40px 16px;
          }

          .cp-faq-title {
            font-size: 32px;
            margin-bottom: 32px;
          }

          .cp-faq-question-btn {
            padding: 18px 20px;
            font-size: 15px;
          }

          .cp-faq-answer {
            padding: 0 20px;
          }

          .cp-faq-item.cp-faq-open .cp-faq-answer {
            padding: 20px;
          }

          .cp-faq-icon {
            margin-left: 16px;
          }
        }
      `}</style>

      <div className="cp-faq-wrapper" ref={faqRef}>
        <h1 className="cp-faq-title">Frequently Asked Questions</h1>
        
        <ul className="cp-faq-list">
          {faqs.map((faq) => (
            <li 
              key={faq.id} 
              className={`cp-faq-item ${openId === faq.id ? 'cp-faq-open' : ''}`}
            >
              <button 
                className="cp-faq-question-btn"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={openId === faq.id}
              >
                <span>{faq.question}</span>
                <span className="cp-faq-icon">+</span>
              </button>
              
              <div className="cp-faq-answer">
                <p className="cp-faq-answer-text">{faq.answer}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FAQPage;
