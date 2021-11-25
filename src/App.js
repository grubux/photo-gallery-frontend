import "./reset.css";
import "./App.css";
import { useState, useEffect } from "react";
import Gallery from "react-photo-gallery";
import reactImageSize from "react-image-size";
import axios from "axios";
import calculateAspectRatio, { gcd } from "calculate-aspect-ratio";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Data useless for now
  const [data, setData] = useState({});
  const [imagesGood, setImagesGood] = useState([]);

  // Backend URL
  const url = "http://localhost:3003/api";

  let aspectRatio = 1;
  // The following two functions are to get the height and width of the image
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
    // We get the images locations from the back (they are in the frontend public directory)
    axios.get(url).then(async (res) => {
      setData(res.data);
      console.log("res.data: ", res.data);

      console.log("Res.data : ", res.data);
      // This is to get the ratio : like 16:9 or 4:3, from the previously calculated height and width of image

      const getRatio = async (dataRaw) => {
        dataRaw.pathStyled.forEach(async (image, index) => {
          const sizeWidth = await getSizesWidth(image);
          const sizeHeight = await getSizesHeight(image);
          aspectRatio = calculateAspectRatio(sizeWidth, sizeHeight);
          const greatestCommonDivisor = gcd(sizeWidth, sizeHeight);

          // Some tests to parse the result of aspect ratio and use it
          // const regwidth = new RegExp(/(\d)+:\d+/g);

          const imagesGoodRaw = dataRaw.pathStyled.map((image) => {
            return {
              src: "." + image,
              // This is where we set the ratio. Problem : i want to set it dynamically based on the ratio of the image
              width: 16,
              height: 9,
            };
          });
          // We set this final state, to use it in the JSX
          setImagesGood(imagesGoodRaw);
          console.log("greatestCommonDivisor: ", greatestCommonDivisor);
          console.log("aspectRatio: ", aspectRatio);
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
    <div>IS LOADING, Please wait</div>
  ) : imagesGood ? (
    <div>
      <Gallery photos={imagesGood} />
    </div>
  ) : (
    <div>Error</div>
  );
};

export default App;
