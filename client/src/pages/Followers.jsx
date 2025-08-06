import { useParams } from "react-router-dom";
import { ListOfPeople } from "../components/peopleList";
import { useState, useEffect } from "react";
import "./Followers.scss";
export const FollowersList = () => {
  const [followers, setFollowers] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { id } = useParams();
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(`/api/users/followers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const users = await res.json();
          setFollowers(users);
        } else {
          console.error("fail to fetch users");
        }
      } catch (error) {
        console.error("Fail to fetch users", error);
      }
    };
    fetchPeople();
  }, []);
  return (
    <div className="followers-page">
      <h1>Followers</h1>
      <ListOfPeople
        people={followers}
        type="followers"
        setPeople={setFollowers}
      />
    </div>
  );
};
