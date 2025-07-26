import { ListOfPeople } from "../components/peopleList.jsx";
import { useState, useEffect } from "react";
import "./People.scss";
import { getSocket } from "../socket.js";
export const People = () => {
  const [people, setPeople] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isGlobal, setIsGlobal] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(`/api/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const users = await res.json();
          setPeople(users);
        } else {
          console.error("fail to fetch users");
        }
      } catch (error) {
        console.error("Fail to fetch users", error);
      }
    };
    const fetchFollowing = async () => {
      const id = userId;
      try {
        const res = await fetch(`/api/users/followings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const users = await res.json();
          setFollowing(users);
        } else {
          console.error("fail to fetch users");
        }
      } catch (error) {
        console.error("Fail to fetch users", error);
      }
    };
    fetchFollowing();
    fetchPeople();
  }, [token, userId]);

  return (
    <div className="people-page">
      <h1>People</h1>

      <ListOfPeople
        people={isGlobal ? people : following}
        setPeople={setPeople}
        type="people"
        setIsGlobal={setIsGlobal}
        isGlobal={isGlobal}
        setFollowing={setFollowing}
      />
    </div>
  );
};
