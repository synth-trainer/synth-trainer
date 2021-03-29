import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Card, Form } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import VolumeControl from "./SynthComponents/VolumeControl";
import Keyboard from "./SynthComponents/Keyboard";
import OscillatorCard from "./SynthComponents/OscillatorCard";
import ADSRCard from "./SynthComponents/ADSRCard";
import FilterCard from "./SynthComponents/FilterCard";
import VibratoCard from "./SynthComponents/VibratoCard";
import "./Sandbox.css";

const Sandbox = () => {
  //Oscillator Parameters
  const [mainWaveform, setMainWaveform] = useState("sawtooth");
  const [modulationWaveform, setModulationWaveform] = useState("sawtooth");
  //Volume
  const [volume, setVolume] = useState(100);
  //ADSR Parameters
  const [attackValue, setAttackValue] = useState(0.1);
  const [decayValue, setDecayValue] = useState(0);
  const [sustainValue, setSustainValue] = useState(1.0);
  const [releaseValue, setReleaseValue] = useState(0.5);
  //Filter Parameters
  const [filterFrequency, setFilterFrequency] = useState(0);
  const [filterType, setFilterType] = useState("highpass");
  const [rollOff /*setRollOff*/] = useState(-12);
  //Vibrato Parameters
  const [vibratoEnabled, setVibratoEnabled] = useState(false);

  //Vibrato Effect
  const vibrato = new Tone.Vibrato({
    frequency: "1n",
    depth: 1,
  }).toDestination();

  //Filter Effect
  const filter = new Tone.Filter(
    filterFrequency,
    filterType,
    rollOff
  ).toDestination();

  //Initializing Synth Settings
  const synthSettings = {
    oscillator: {
      type: mainWaveform,
    },
    envelope: {
      attack: attackValue,
      decay: decayValue,
      sustain: sustainValue,
      release: releaseValue,
    },
    modulation: {
      type: modulationWaveform,
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0.5,
      sustain: 0.5,
      release: 0.5,
    },
    volume: volume - 100,
  };

  //Instantiating Synth Object
  const polySynth = new Tone.PolySynth(Tone.FMSynth, synthSettings).chain(
    filter
  );

  //Handles generating notes
  const playTone = (noteFrequency) => {
    polySynth.triggerAttackRelease(noteFrequency, attackValue + 0.01);
  };

  const oscillatorHandler = (event, oscillator) => {
    const { name } = event.currentTarget;
    if (oscillator === 1) {
      setMainWaveform(name);
    } else {
      setModulationWaveform(name);
    }
  };

  const filterHandler = (event) => {
    const { name } = event.currentTarget;
    setFilterType(name);
  };

  const vibratoHandler = () => {
    if (!vibratoEnabled) {
      setVibratoEnabled(true);
    } else {
      setVibratoEnabled(false);
    }
  };

  //Turns Vibrato on or off. Depends on vibratoEnabled
  useEffect(() => {
    Tone.start();
    if (vibratoEnabled) {
      polySynth.chain(filter, vibrato, Tone.Destination);
    } else {
      polySynth.disconnect();
      //Tone's disconnect method disconnects all nodes
      //so we have to reconnect the ones we want manually
      polySynth.connect(filter); // <- reconnecting filter
    }
  }, [vibratoEnabled, filter, polySynth, vibrato]);

  return (
    <div className="background">
      <Grid
        container
        alignItems="center"
        alignContent="center"
        justify="center"
        spacing={2}
        direction="row"
      >
        <Grid item xs={12}>
          <h1
            style={{ color: "white" }}
            className="text-3xl text-center font-bold"
          >
            Sandbox
          </h1>
        </Grid>

        {/*Keyboard*/}
        <Grid item>
          <Grid container alignItems="center">
            <Grid item xs={12}>
              <Card
                id="keyboard-card"
                className="text-center keyboard-color"
                style={{ width: Keyboard.keyboardWidth }}
              >
                <Card.Title id="envelope-label" style={{ color: "white" }}>
                  Keyboard
                </Card.Title>
                <Grid item xs={12}>
                  <Grid
                    container
                    alignItems="center"
                    alignContent="center"
                    xs={12}
                    justify="center"
                    spacing={2}
                    direction="row"
                  >
                    <Grid item xs={3}>
                      <OscillatorCard
                        waveform={mainWaveform}
                        oscillatorTitle={"Oscillator 1"}
                        oscillatorID={1}
                        oscillatorHandler={oscillatorHandler}
                      />
                      <OscillatorCard
                        waveform={modulationWaveform}
                        oscillatorTitle={"Oscillator 2"}
                        oscillatorID={2}
                        oscillatorHandler={oscillatorHandler}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <ADSRCard
                        attackStuff={[attackValue, setAttackValue]}
                        decayStuff={[decayValue, setDecayValue]}
                        sustainStuff={[sustainValue, setSustainValue]}
                        releaseStuff={[releaseValue, setReleaseValue]}
                        frequencyStuff={[filterFrequency, setFilterFrequency]}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Card id="volumeControlCard" bg="light">
                        <VolumeControl volume={volume} setVolume={setVolume} />
                      </Card>
                      <Card id="filterCard" bg="light">
                        <FilterCard
                          filterType={filterType}
                          filterFrequency={filterFrequency}
                          setFilterFrequency={setFilterFrequency}
                          filterHandler={filterHandler}
                          id="FilterSlider"
                        />
                      </Card>
                      <Card id="vibratoCard" bg="light">
                        <VibratoCard vibratoHandler={vibratoHandler} />
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Form>
                  <br />
                  <Keyboard playTone={playTone} />
                </Form>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Sandbox;
