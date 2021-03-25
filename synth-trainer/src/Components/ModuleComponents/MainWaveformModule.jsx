import React, { useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import * as Tone from "tone";
import WaveformExample from "./WaveformExample";
import { navigate } from "@reach/router";
import { useEffect } from "react";
import { addInProgressModules, getModuleRef } from "../../firebase";
import { UserContext } from "../../providers/UserProvider";
import Grid from "@material-ui/core/Grid";
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
    <div>
      <Card id="sign-in-card" className="text-center w-50 customCard">
        <Card.Title id="sign-in-label">Intro: Basic Waveforms</Card.Title>
        <Card.Text>
          Oscillators are the fundamental building blocks of a synths. The word
          “oscillator” sounds complicated, but it’s a fancy word with a simple
          meaning. An oscillator creates a sound.
        </Card.Text>

        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <WaveformExample
                waveform="sine"
                message="A sine wave is the simplest waveform with no harmonics or overtones. 
                        It generates a smooth, clean sound, much like the way the waveform looks."
                volume={volume}
                setVolume={setVolume}
                buttonHandler={buttonHandler}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <WaveformExample
                waveform="sine"
                message="A sine wave is the simplest waveform with no harmonics or overtones. 
                        It generates a smooth, clean sound, much like the way the waveform looks."
                volume={volume}
                setVolume={setVolume}
                buttonHandler={buttonHandler}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <WaveformExample
                waveform="sine"
                message="A sine wave is the simplest waveform with no harmonics or overtones. 
                        It generates a smooth, clean sound, much like the way the waveform looks."
                volume={volume}
                setVolume={setVolume}
                buttonHandler={buttonHandler}
              />
            </Grid>
          </Grid>
        </Grid>




        <Grid item container direction="row" spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <WaveformExample
              waveform="sine"
              message="A sine wave is the simplest waveform with no harmonics or overtones. 
                      It generates a smooth, clean sound, much like the way the waveform looks."
              volume={volume}
              setVolume={setVolume}
              buttonHandler={buttonHandler}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <WaveformExample
              waveform="triangle"
              message="Rather than a smooth, curvy waveform, the triangle wave consists of
              repeating upward and downward slopes that generate a slightly brighter tone than
              sine waves."
              volume={volume}
              setVolume={setVolume}
              buttonHandler={buttonHandler}
            />
          </Grid>
        </Grid>
        <br />
        {/* in between */}
        <Grid item container direction="row" spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <WaveformExample
              waveform="square"
              message="A square wave generates a buzzier tone than a sine wave due to its
            instant changes in amplitude. It introduces harmonics."
              volume={volume}
              setVolume={setVolume}
              buttonHandler={buttonHandler}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <WaveformExample
              waveform="sawtooth"
              message="Sawtooth waves generate the richest tones of the 4 common waveforms.
              Its waveform consists of linear rises followed by the instant amplitude change,
              much like the square wave."
              volume={volume}
              setVolume={setVolume}
              buttonHandler={buttonHandler}
            />
          </Grid>
        </Grid>
        <br />
        <Button onClick={buttonHandler} name="next">
          Take the Test!
        </Button>
      </Card>
    </div>
  );
};

export default MainWaveformModule;
