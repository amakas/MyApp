import { useState, useEffect } from "react";
import { ListOfPeople } from "../components/peopleList";
import { useParams } from "react-router-dom";
import "./Following.scss";
export const FollowingList = () => {
  const [followings, setFollowings] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { id } = useParams();
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(`/api/users/followings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const users = await res.json();
          setFollowings(users);
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
    <div className="following-page">
      <h1>Following</h1>
      <ListOfPeople
        people={followings}
        type="followings"
        setPeople={setFollowings}
      />
    </div>
  );
};
