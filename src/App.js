import "./reset.css";
import "./App.css";
import { useState, useEffect } from "react";
import Gallery from "react-photo-gallery";
import reactImageSize from "react-image-size";
import axios from "axios";
import calculateAspectRatio, { gcd } from "calculate-aspect-ratio";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [imagesGood, setImagesGood] = useState([]);

  const url = "http://localhost:3003/api";

  let aspectRatio = 1;

  const getSizesWidth = async (img) => {
    try {
      const { width } = await reactImageSize(img);
      console.log("width: ", width);
      return width;
    } catch {
      console.log("error in tryCatch of images const");
    }
  };

  const getSizesHeight = async (img) => {
    try {
      const { height } = await reactImageSize(img);
      console.log("height: ", height);
      return height;
    } catch {
      console.log("error in tryCatch of images const");
    }
  };

  const fetchData = async () => {
    axios.get(url).then(async (res) => {
      setData(res.data);
      console.log("res.data: ", res.data);

      console.log("Res.data : ", res.data);
      const getRatio = async (dataRaw) => {
        dataRaw.pathStyled.forEach(async (image, index) => {
          const sizeWidth = await getSizesWidth(image);
          const sizeHeight = await getSizesHeight(image);
          aspectRatio = calculateAspectRatio(sizeWidth, sizeHeight);
          const greatestCommonDivisor = gcd(sizeWidth, sizeHeight);

          console.log("greatestCommonDivisor: ", greatestCommonDivisor);

          // const regwidth = new RegExp(/(\d)+:\d+/g);
          console.log("aspectRatio: ", aspectRatio);

          const imagesGoodRaw = dataRaw.pathStyled.map((image) => {
            return {
              src: "." + image,
              width: 16,
              height: 9,
            };
          });
          // const imagesGoodRaw = dataRaw.pathStyled.map((image) => { //GOOD
          //   return {
          //     src: "." + image,
          //     width: 16,
          //     height: 9,
          //   };
          // });
          setImagesGood(imagesGoodRaw);
          console.log("imageGood: ", imagesGoodRaw);
        });
      };
      await getRatio(res.data);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  return isLoading ? (
    <div>IS LOADING, WAIT !!!</div>
  ) : imagesGood ? (
    <div>
      <Gallery photos={imagesGood} />
    </div>
  ) : (
    <div>Error</div>
  );
};

export default App;
