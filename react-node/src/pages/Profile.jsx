import React, { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.css";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const userCtx = useContext(UserContext); // used for only display username
  const fetchData = useFetch();
  const navigate = useNavigate();

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likes, setLikes] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");

  const [follow, setFollow] = useState("");
  const [unfollow, setUnfollow] = useState("");
  const [followStatus, setFollowStatus] = useState(false);

  // DO NOTE THAT ALL THE PROFILES, IT IS NOT USERCTX.USERNAME - IT SHOULD BE WHOEVER WE CLICKED ON - USERCTX.USERNAME IS FOR DEV PURPOSES
  const getProfileStatInfo = async () => {
    const res = await fetchData(
      "/users/user/" + userCtx.username,
      "POST",
      undefined,
      undefined
    );

    if (res.ok) {
      setFollowing(res.data.following);
      setFollowers(res.data.followers);
      setLikes(res.data.liked_videos);
      setProfilePicture(res.data.profilePicture);
      console.log(res.data);
    }
  };

  useEffect(() => {
    if (followers.includes(userCtx.username)) {
      setFollowStatus(true);
    }
  }, [followers]);

  const followProfile = async () => {
    const res = await fetchData(
      "/users/" + userCtx.username,
      "PUT",
      {
        followers: follow,
        following: userCtx.username,
      },
      undefined
    );

    if (res.ok) {
      getProfileStatInfo();
      setFollowStatus(true);
      setFollow("");
    } else {
      alert("Unable to follow profile");
    }
  };

  const handleFollow = () => {
    setFollow(userCtx.username);
  };

  const unfollowProfile = async () => {
    const res = await fetchData(
      "/users/rm/" + userCtx.username,
      "PUT",
      {
        followers: unfollow,
        following: userCtx.username,
      },
      undefined
    );

    if (res.ok) {
      getProfileStatInfo();
      setFollowStatus(false);
      setUnfollow("");
    } else {
      alert("Unable to unfollow them >: ) ");
    }
  };

  const handleUnfollow = () => {
    setUnfollow(userCtx.username);
  };

  useEffect(() => {
    getProfileStatInfo();
  }, []);

  useEffect(() => {
    if (unfollow) {
      unfollowProfile();
    }
  }, [unfollow]);

  useEffect(() => {
    if (follow) {
      followProfile();
    }
  }, [follow]);

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div>
          <img
            className={styles.profilePicture}
            src={
              profilePicture
                ? profilePicture
                : "https://i.pravatar.cc/150?img=6"
            }
            alt=""
          />
        </div>
        <h1>{`@${userCtx.username}`}</h1>
        <div className={styles.profileStats}>
          <div className="following">
            <h4>{following ? following.length : 0}</h4>
            <h3>following</h3>
          </div>
          <div className="followers">
            <h4>{followers ? followers.length : 0}</h4>
            <h3>followers</h3>
          </div>
          <div className="likes">
            <h4>{likes ? likes.length : 0}</h4>
            <h3>likes</h3>
          </div>
        </div>
        <div className={styles.profileButtons}>
          {/* {followStatus ? <button>unfollow</button> : <button>follow</button>} */}
          {followStatus ? (
            <div className="unfollowBtn">
              <button
                className={styles.button}
                onClick={() => handleUnfollow()}
              >
                Unfollow
              </button>
            </div>
          ) : (
            <div className="followBtn">
              <button className={styles.button} onClick={() => handleFollow()}>
                Follow
              </button>
            </div>
          )}

          <div className="messageBtn">
            <button className={styles.button} onClick={() => navigate("/dm")}>
              Message
            </button>
          </div>
        </div>
        <div className="profileDescription">
          <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h4>
        </div>
      </div>
    </div>
  );
};

export default Profile;
