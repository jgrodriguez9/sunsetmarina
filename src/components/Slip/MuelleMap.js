import ImageMapper from 'react-img-mapper';
import mapMuelle from "../../assets/images/muelle.png";
//json
const testJson = [
    {
        "id": "469f9800-c45a-483f-b13e-bd24f3fb79f4",
        "title": "Slip No 1",
        "shape": "rect",
        "fillColor": "green",
        //"preFillColor": "gray",
        "coords": [31, 38, 96, 104]
    },
    {
        "id": "469f9800-c45a-483f-b13e-bd24f3fb79f6",
        "title": "Slip No 2",
        "shape": "rect",
        "fillColor": "green",
        //"preFillColor": "gray",
        "coords": [103, 38, 169, 104]
    }
]

export default function MuelleMap(){
    const MAP = {
        name: 'my-map',
        // GET JSON FROM BELOW URL AS AN EXAMPLE
        areas: testJson,
      };

      const handleClickImg = (area) => {
        console.log(area)
      }
    
      return (
        <ImageMapper 
            src={mapMuelle} 
            map={MAP} 
            onClick={area => handleClickImg(area)}
        />
      )
}