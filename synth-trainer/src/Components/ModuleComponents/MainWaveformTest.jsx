// ( ) Generate 10 different waves
// ( ) Text at the top to indicate what number/10 the user is working on
// ( ) User hits play button to hear sound
// ( ) They click button they think the sound is
// (X) If correct -> button turns green
// (X) If wrong -> button turns red and correct waveform displays green
// ( ) user clicks next to load next sound
// ( ) after 10 the user can click see score to view results

import React, { useState } from "react";
import * as Tone from "tone";
import { Card, Button } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Repeat from "@material-ui/icons/Repeat";
import {
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
} from "@material-ui/core";
import { useContext } from "react";
import {
  addInProgressModules,
  getModuleRef,
  removeInProgressModule,
  addCompletedModules,
} from "../../firebase";
import { UserContext } from "../../providers/UserProvider";
import { useEffect } from "react";
import { navigate } from "@reach/router";
import VolumeControl from "../SynthComponents/VolumeControl";

const waveforms = ["sine", "square", "sawtooth", "triangle"];

const MainWaveformTest = () => {
  const user = useContext(UserContext);

  useEffect(() => {
    const loadData = async () => {
      addInProgressModules("MainWaveformModule");
      setModuleRef(await getModuleRef("MainWaveformModule"));
    };

    loadData();
  }, [user]);

  let waveform = "";

  const [userGuess, setUserGuess] = useState([false, ""]);
  const [waveformHook, setWaveformHook] = useState(waveform);
  const [canPlayNewSound, setCanPlayNewSound] = useState(true);
  const [userPassed, setUserPassed] = useState();
  const [moduleRef, setModuleRef] = useState();
  const [score, setScore] = useState(0);
  const [currentTest, setCurrentTest] = useState(0);

  //Volume
  const [volume, setVolume] = useState(100);

  let playingSound = false;
  const PLAYING_TIME = 1;
  let synthSettings = {};
  let polySynth = new Tone.PolySynth(
    Tone.FMSynth,
    synthSettings
  ).toDestination();

  const createSynth = () => {
    synthSettings = {
      oscillator: {
        type: waveform,
      },
      volume: volume - 100,
    };
    polySynth.set(synthSettings);
  };

  //Handles generating notes
  const playTone = (noteFrequency) => {
    if (!playingSound) {
      playingSound = true;
      polySynth.triggerAttackRelease(noteFrequency, PLAYING_TIME);
      setTimeout(() => (playingSound = false), PLAYING_TIME * 1000);
    }
  };

  const handleButton = (event) => {
    const { name } = event.currentTarget;
    switch (name) {
      case "playSound":
        setUserGuess([false, ""]);
        setCurrentTest(currentTest + 1);
        setCanPlayNewSound(false);

        // play random waveform
        waveform = waveforms[Math.floor(Math.random() * waveforms.length)];
        setWaveformHook(waveform);
        createSynth();
        playTone("C4");
        break;

      case "replaySound":
        // createSynth();
        playTone("C4");
        break;

      case "submit":
        if (score >= 0) {
          setUserPassed(true);
          break;
        } else {
          setUserPassed(false);
          break;
        }

      case "closeFinalDialog":
        // add current module to completed modules
        if (userPassed) {
          addCompletedModules("MainWaveformModule", score);
        }
        break;

      case "home":
        removeInProgressModule(user, "MainWaveformModule").then(() => {
          navigate("/");
        });
        break;

      case "return":
        navigate(moduleRef.address);
        break;

      case "tryAgain":
        // reset all test user variables
        setScore(0);
        setCurrentTest(0);
        setUserGuess([false, ""]);
        setCanPlayNewSound(true);
        setUserPassed(undefined);
        break;

      default:
        // set user has guess and current guess value
        setUserGuess([true, name]);

        if (name === waveformHook) {
          setScore(score + 1);
        }
        setCanPlayNewSound(true);
    }
  };

  if (moduleRef === undefined) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <Card bg="info">
        <Card.Title>Waveform Test</Card.Title>
        <Card.Text>
          {currentTest === 0 ? "Press Play to Begin!" : "Wave: " + currentTest}
        </Card.Text>
        <Card.Text>Score: {score}</Card.Text>
        <Card.Body>
          <LinearProgress
            variant="determinate"
            value={currentTest * 10}
          ></LinearProgress>
          <Button
            name="playSound"
            onClick={handleButton}
            disabled={!canPlayNewSound || (currentTest === 10 && userGuess[0])}
          >
            <PlayArrow />
          </Button>
          <Button
            name="replaySound"
            onClick={handleButton}
            disabled={canPlayNewSound || (currentTest === 10 && userGuess[0])}
          >
            <Repeat />
          </Button>
          <VolumeControl volume={volume} setVolume={setVolume} />
          <Grid container spacing={2}>
            <Grid item>
              <Button
                name="sawtooth"
                variant={
                  userGuess[0] && waveformHook === "sawtooth"
                    ? "success"
                    : userGuess[0] &&
                      userGuess[1] === "sawtooth" &&
                      waveformHook !== "sawtooth"
                    ? "danger"
                    : "primary"
                }
                onClick={handleButton}
                disabled={
                  canPlayNewSound || (currentTest === 10 && userGuess[0])
                }
              >
                Sawtooth
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={
                  userGuess[0] && waveformHook === "sine"
                    ? "success"
                    : userGuess[0] &&
                      userGuess[1] === "sine" &&
                      waveformHook !== "sine"
                    ? "danger"
                    : "primary"
                }
                name="sine"
                onClick={handleButton}
                disabled={
                  canPlayNewSound || (currentTest === 10 && userGuess[0])
                }
              >
                Sine
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={
                  userGuess[0] && waveformHook === "square"
                    ? "success"
                    : userGuess[0] &&
                      userGuess[1] === "square" &&
                      waveformHook !== "square"
                    ? "danger"
                    : "primary"
                }
                name="square"
                onClick={handleButton}
                disabled={
                  canPlayNewSound || (currentTest === 10 && userGuess[0])
                }
              >
                Square
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={
                  userGuess[0] && waveformHook === "triangle"
                    ? "success"
                    : userGuess[0] &&
                      userGuess[1] === "triangle" &&
                      waveformHook !== "triangle"
                    ? "danger"
                    : "primary"
                }
                name="triangle"
                onClick={handleButton}
                disabled={
                  canPlayNewSound || (currentTest === 10 && userGuess[0])
                }
              >
                Triangle
              </Button>
            </Grid>
          </Grid>
        </Card.Body>
      </Card>
      <Button
        name="submit"
        onClick={handleButton}
        disabled={!(currentTest === 10 && userGuess[0])}
      >
        Submit
      </Button>

      <Dialog
        open={userPassed !== undefined}
        keepMounted
        maxWidth="sm"
        fullWidth
        name="finalDialog"
      >
        <DialogContent>
          <h2>
            You got {score} / {currentTest}
          </h2>
          <h3>{userPassed ? "Nice!" : "So Close!"}</h3>
        </DialogContent>
        <DialogActions>
          {userPassed ? (
            <Button name="home" onClick={handleButton}>
              Return to Home
            </Button>
          ) : (
            <div>
              <Button name="return" onClick={handleButton}>
                Return to Module
              </Button>
              <Button name="tryAgain" onClick={handleButton}>
                Try Again
              </Button>
              <Button name="home" onClick={handleButton}>
                Return to Home
              </Button>
            </div>
          )}
          <Button onClick={handleButton} name="closeFinalDialog">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainWaveformTest;
