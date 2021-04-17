import React, { useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import * as Tone from "tone";
import WaveformExample from "./WaveformExample";
import { navigate } from "@reach/router";
import { useEffect } from "react";
import { addInProgressModules, getModuleRef } from "../../firebase";
import { UserContext } from "../../providers/UserProvider";
import Grid from "@material-ui/core/Grid";
import Columns from "react-columns";
import "./MainWaveformModule.css";

const MainWaveformModule = (props) => {
  const user = useContext(UserContext);

  useEffect(() => {
    const initializeData = async () => {
      const result = await getModuleRef("MainWaveformModule");
      addInProgressModules("MainWaveformModule");

      setModuleRef(result);
    };
    initializeData();
  }, [user]);

  const [moduleRef, setModuleRef] = useState(null);
  //Oscillator Parameters
  let mainWaveform = "";
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
        type: mainWaveform,
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

  const buttonHandler = (event) => {
    const { name } = event.currentTarget;
    if (name === "next") {
      navigate(moduleRef.test_address);
      return;
    }
    mainWaveform = name;
    createSynth();
    playTone("C4");
  };

  if (moduleRef === undefined) {
    return <p>Loading</p>;
  }
  

  return (
    <div className = "background">
      <Card id="sign-in-card" className="text-center w-50 customCard" alignItems="center">
        <Card.Title id="sign-in-label">Intro: Basic Waveforms</Card.Title>
        <Card.Text>
          Oscillators are the fundamental building blocks of a synths. The word
          “oscillator” sounds complicated, but it’s a fancy word with a simple
          meaning. An oscillator creates a sound.
        </Card.Text>
        <Card.Body>
          <Columns columns="2" gap = "3px">
            <WaveformExample
              waveform="sine"
              message="A sine wave is the simplest waveform with no harmonics or overtones. 
                      It generates a smooth, clean sound, much like the way the waveform looks."
              volume={volume}
              setVolume={setVolume}
              buttonHandler={buttonHandler}
            />
            <WaveformExample
                waveform="triangle"
                message="Rather than a smooth, curvy waveform, the triangle wave consists of
                repeating upward and downward slopes that generate a slightly brighter tone than
                sine waves."
                volume={volume}
                setVolume={setVolume}
                buttonHandler={buttonHandler}
            />
            <WaveformExample
              waveform="square"
              message="A square wave generates a buzzier tone than a sine wave due to its
              instant changes in amplitude. It introduces an important music term called harmonics."
              volume={volume}
              setVolume={setVolume}
              buttonHandler={buttonHandler}
            />
            <WaveformExample
              waveform="sawtooth"
              message="Sawtooth waves are the richest tones of the 4 common waveforms.
              Its waveform consists of linear rises followed by instant amplitude change, similar to the square wave."
              volume={volume}
              setVolume={setVolume}
              buttonHandler={buttonHandler}
            />
          </Columns>
        </Card.Body>
        <Button onClick={buttonHandler} name="next">
          Take the Test!
        </Button>
      </Card>
    </div>
  );
};

export default MainWaveformModule;
