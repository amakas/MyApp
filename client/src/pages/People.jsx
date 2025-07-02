import { ListOfPeople } from "../components/peopleList.jsx";
import { useState, useEffect } from "react";
import "./People.scss";

export const People = () => {
  const [people, setPeople] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchPeople = async () => {
      const id = userId;
      try {
        const res = await fetch(`/api/users/all/${id}`, {
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
    fetchPeople();
  }, []);

  return (
    <div className="people-page">
      <h1>People</h1>

      <ListOfPeople people={people} />
    </div>
  );
};
