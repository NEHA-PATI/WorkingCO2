import React from 'react';
import "@features/user/styles/activities.css";
import { useNavigate } from 'react-router-dom';

const activities = [
  {
    title: 'Plant a Tree',
    image: 'https://img.freepik.com/free-vector/hand-drawn-people-planting-tree-illustration_23-2149214943.jpg?t=st=1752475331~exp=1752478931~hmac=5c15df763c6f2c71def4b2d1ce42835bae2b74628a40932e51b2a6d8e91e7132&w=1800',
    desc: 'Join a local tree-planting event and help restore green spaces in your community.',
    key: 'plant-tree',
    accent: 'var(--color-accent1)'
  },
  {
    title: 'Clean-Up Drive',
    image: 'https://img.freepik.com/free-vector/modern-garbage-collection-waste-sorting-flat-composition-with-volunteers-picking-up-litter-junk-left-outdoor-illustration_1284-60212.jpg?t=st=1752497969~exp=1752501569~hmac=90b9e02cb516167b26c5950342ea2dd0f6790bf3a0017f44e2af541f326448f6&w=1480',
    desc: 'Participate in a neighborhood clean-up to reduce litter and promote recycling.',
    key: 'clean-up',
    accent: 'var(--color-accent2)'
  },
  {
    title: 'Eco-Friendly Commute',
    image: 'https://img.freepik.com/free-vector/landscape-with-couple-using-face-mask-scooter_24877-63725.jpg?t=st=1752486875~exp=1752490475~hmac=fd763f35ac24fcfc601fca493287d58f42e864352d3e8ca1c54680eaf7838f14&w=826',
    desc: 'Use public transport, cycle, or walk to lower your carbon footprint for a day.',
    key: 'eco-commute',
    accent: 'var(--color-accent3)'
  },
  {
    title: 'Plastic Free Challenge',
    image: 'https://img.freepik.com/free-vector/resources-protection-abstract-concept-illustration-protection-natural-resources-land-conservation-safeguarding-nature-smart-water-use-environment-preservation_335657-771.jpg?t=st=1753341575~exp=1753345175~hmac=5fbb84d3d508b7068d3439916d1feeaf1c86f3748e8fb1958d6b9a19322e7f1d&w=1480',
    desc: 'Go Plastic Free. Maintain the Streak without breaking it. Live in a Plastic Free World. ',
    key: 'plastic-free',
    accent: 'var(--color-accent4)'
  }
];

const Activities = () => {
  const navigate = useNavigate();
  return (
    <div className="activities-main-bg">
      <div className="activities-header">
        <h2>Activities</h2>
        <h3>Choose your way to make a difference</h3>
        <div className="activities-header-underline"></div>
      </div>
      <div className="activities-cards-container">
        {activities.map((activity, idx) => (
          <div className="activity-card" key={idx} style={{background: activity.accent}} onClick={() => navigate(`/activity/${activity.key}`)}>
            <div className="activity-card-number">{`0${idx + 1}`}</div>
            <div className="activity-card-img-wrap">
              <img src={activity.image} alt={activity.title} className="activity-card-img" />
            </div>
            <div className="activity-card-content">
              <h4 className="activity-card-title">{activity.title}</h4>
              <p className="activity-card-desc">{activity.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities; 
