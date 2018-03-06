import * as React from "react";
import { render } from "react-dom";
import ReactSpeedometer from "react-d3-speedometer";
import "./site.css";
import styled from "react-emotion";

const styles = {
  textAlign: "center"
};

const Container = styled("div")`
  background-image: linear-gradient(-45deg, #000000, #333333);
  width: 100%;
  height: 100vh;
  padding-top: 10px;
`;

const Screw = styled("img")`
  height: 50px;
  position: absolute;
  top: -25px;
`;

const YellowBar = styled("div")`
  font-size: 1.7rem;
  background-color: yellow;
  display: inline-block;
  padding: 5px;
  border-radius: 3px;
  margin-bottom: 25px;
  align-items: center;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const WhitePanel = styled("div")`
  background: white;
  display: inline-block;
  padding: 10vw;
  height: 23vw;
  border-radius: 4px;
  width: 50%;
`;

const MeterContainer = styled("div")`
  position: absolute;
`;

interface State {
  counter: number;
  zenuwacky: number;
  longitude: number;
  latitude: number;
}

export default class App extends React.Component<{}, State> {
  state = {
    counter: 220,
    zenuwacky: 0,
    longitude: 0,
    latitude: 0
  };

  interval: number;

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ zenuwacky: -10 + Math.floor(Math.random() * 20) });
    }, 100);
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(position => {
        console.log(position);
        this.setState({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        });
        var url: string =
          "https://iapandora.nl/geigercounter/api/" +
          this.state.latitude +
          "/" +
          this.state.longitude;
        this.setState({ counter: this.get(url).result });
      });
    } else {
      console.log("Geolocation is not supported :(");
    }
  }

  get(url: string) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const meterWidth = window.innerWidth / 2;
    return (
      <div style={styles}>
        <Container>
          <YellowBar>GEIGER COUNTER</YellowBar>
          <div style={{ position: "relative" }}>
            <Screw
              style={{
                left: "2%"
              }}
              src="https://cdn.sstatic.net/Sites/diy/img/apple-touch-icon@2.png"
            />
            <Screw
              style={{
                right: "2%"
              }}
              src="https://cdn.sstatic.net/Sites/diy/img/apple-touch-icon@2.png"
            />
          </div>
          <WhitePanel>
            <MeterContainer>
              <ReactSpeedometer
                needleTransition="easeElastic"
                needleTransitionDuration={2000}
                minValue={0}
                maxValue={500}
                value={this.state.counter + this.state.zenuwacky}
                startColor="white"
                endColor="red"
                segments={5}
                width={meterWidth}
                height="10000px"
                currentValueText="${value} CPM"
                valueFormat="d"
              />
            </MeterContainer>
          </WhitePanel>
          <div style={{ position: "relative" }}>
            <Screw
              style={{
                left: "2%"
              }}
              src="https://cdn.sstatic.net/Sites/diy/img/apple-touch-icon@2.png"
            />
            <Screw
              style={{
                right: "2%"
              }}
              src="https://cdn.sstatic.net/Sites/diy/img/apple-touch-icon@2.png"
            />
          </div>
          <YellowBar
            style={{
              fontSize: "1rem",
              marginTop: "20px"
            }}
          >
            PANDORA
          </YellowBar>
        </Container>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
