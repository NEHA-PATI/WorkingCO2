import React from 'react';
import { useNavigate } from 'react-router-dom';
import "@features/user/styles/engage.css";


const Engage = () => {
  const navigate = useNavigate();
  return (
    <div className="engage-page">
     <h1 className="engage-title">Welcome to Engage!</h1>
      <p className="engage-intro">
        Dive into our vibrant community, challenge yourself with games, and climb the leaderboard. 
        Connect, play, and grow in a space designed for learning, fun, and friendly competition—all in a fresh, eco-friendly environment!
      </p>
      <div className="engage-divs">
        <div className="engage-card engage-card-large" onClick={() => navigate('/community')}>
          <div className="engage-card-img engage-card-img-full">
            <img src="https://media.licdn.com/dms/image/v2/D4E12AQHlvEfiU2W0qg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1715092018772?e=2147483647&v=beta&t=J-uCWM6t8pe6tHWL4VTEksseuoYm__r9dxg5q_zH3KU" alt="Community" className="engage-img-pic engage-img-pic-full" />
          </div>
          <div className="engage-label engage-label-large engage-label-small">
            Community
            <div className="engage-desc">Connect, share, and grow with like-minded people.</div>
          </div>
        </div>
        <div className="engage-card engage-card-large" onClick={() => navigate('/game')}>
          <div className="engage-card-img engage-card-img-full">
            <img src="https://618media.com/wp-content/uploads/2024/02/dlss-3-sustainability-in-gaming-tech.webp" alt="Games" className="engage-img-pic engage-img-pic-full" />
          </div>
          <div className="engage-label engage-label-large engage-label-small">
            Games
            <div className="engage-desc">Play, compete, and enjoy interactive fun.</div>
          </div>
        </div>
        <div className="engage-card engage-card-large" onClick={() => navigate('/activities')}>
          <div className="engage-card-img engage-card-img-full">
            <img src="https://t3.ftcdn.net/jpg/09/54/00/14/360_F_954001415_GbBeL0aHqcbhgHNwrHNAakBSPer076q9.jpg" alt="LeaderBoard" className="engage-img-pic engage-img-pic-full" />
          </div>
          <div className="engage-label engage-label-large engage-label-small">
            Activities
            <div className="engage-desc">Complete daily activites for exciting rewards.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Engage;