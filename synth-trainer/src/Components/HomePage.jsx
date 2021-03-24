import { navigate } from "@reach/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import {
  getInProgressModules,
  getAllModules,
  removeInProgressModule,
} from "../firebase.js";
import { UserContext } from "../providers/UserProvider.jsx";

const HomePage = () => {
  const user = useContext(UserContext);

  const [inProgressModules, setInProgressModules] = useState([{}]);
  const [allModules, setAllModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getInProgressModules(user);
      const modules = await getAllModules();

      setInProgressModules(result);
      setAllModules(modules);
    };

    fetchData();
  }, [user]);

  const handleButton = async (event) => {
    const { name, id } = event.currentTarget;
    switch (name) {
      case "abandonModule":
        const result = await removeInProgressModule(user, id);
        setInProgressModules(result);
        break;
      case "goToButton":
        navigate(id);
        break;
      default:
        break;
    }
  };

  if (inProgressModules === undefined || allModules === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ color: "white" }} className="text-3xl text-center font-bold">
        UNDER CONSTRUCTION
      </h1>
      <h2 style={{ color: "white" }} className="text-3xl text-left font-bold">
        Modules In Progress
      </h2>
      {inProgressModules.map((module) => {
        if (module.name !== undefined && allModules.length > 0) {
          console.log(module.name);
          return (
            <Card bg="info" key={module.name}>
              <Card.Title>
                {module.name.split(/(?=[A-Z])/).join(" ")}
              </Card.Title>
              <Card.Body>
                <p>First Accessed: {module.firstAccess.toDate().toString()}</p>
                <p>Last Accessed: {module.recentAccess.toDate().toString()}</p>
                <Button
                  id={
                    allModules.find(
                      (mainModule) => mainModule.name === module.name
                    ).address
                  }
                  name="goToButton"
                  onClick={handleButton}
                >
                  Go To Module
                </Button>
                <Button
                  id={
                    allModules.find(
                      (mainModule) => mainModule.name === module.name
                    ).test_address
                  }
                  name="goToButton"
                  onClick={handleButton}
                >
                  Go To Test
                </Button>
                <Button
                  id={module.name}
                  name="abandonModule"
                  onClick={handleButton}
                >
                  Abandon Module
                </Button>
              </Card.Body>
            </Card>
          );
        } else {
          return <div>Loading...</div>;
        }
      })}
      <h2 style={{ color: "white" }} className="text-3xl text-left font-bold">
        All Modules
      </h2>
      {allModules.map((module) => {
        if (allModules.length > 0) {
          return (
            <Card key={module.name} bg="info">
              <Card.Title>
                {module.name.split(/(?=[A-Z])/).join(" ")}
              </Card.Title>
              <Card.Body>
                <Button
                  id={module.address}
                  name="goToButton"
                  onClick={handleButton}
                >
                  Go To Module
                </Button>
                <Button
                  id={module.test_address}
                  name="goToButton"
                  onClick={handleButton}
                >
                  Go To Test
                </Button>
              </Card.Body>
            </Card>
          );
        } else {
          return <div>Loading...</div>;
        }
      })}
    </div>
  );
};

export default HomePage;
