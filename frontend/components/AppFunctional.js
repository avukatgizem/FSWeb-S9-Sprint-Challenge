import React, { useState } from "react";
import axios from "axios";

// önerilen başlangıç stateleri

const data = {
  message: "",
  email: "",
  steps: 0,
  index: 4,
};
//  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  const [data, setData] = useState(data);
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY(index) {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    switch (index) {
      case 0:
        return { x: 1, y: 1 };
      case 1:
        return { x: 2, y: 1 };
      case 2:
        return { x: 3, y: 1 };
      case 3:
        return { x: 1, y: 2 };
      case 4:
        return { x: 2, y: 2 };
      case 5:
        return { x: 3, y: 2 };
      case 6:
        return { x: 1, y: 3 };
      case 7:
        return { x: 2, y: 3 };
      case 8:
        return { x: 3, y: 3 };
      default:
        break;
    }
  }

  function getXYMesaj(coordinates) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    let x = coordinates.x;
    let y = coordinates.y;
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setData(data);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.

    switch (yon) {
      case "left": {
        const coordinate = getXY(data.index);
        if (coordinate.x != 1) {
          setData({
            ...data,
            index: data.index - 1,
            steps: data.steps + 1,
            message: "",
          });
        } else {
          setData({ ...data, message: "Sola gidemezsiniz" });
        }
        break;
      }

      case "up": {
        const coordinate = getXY(data.index);
        if (coordinate.y != 1) {
          setData({
            ...data,
            index: data.index - 3,
            steps: data.steps + 1,
            message: "",
          });
        } else {
          setData({ ...data, message: "Yukarıya gidemezsiniz" });
        }
        break;
      }

      case "right":
        {
          const coordinate = getXY(data.index);
          if (coordinate.x != 3) {
            setData({
              ...data,
              index: data.index + 1,
              steps: data.steps + 1,
              message: "",
            });
          } else {
            setData({ ...data, message: "Sağa gidemezsiniz" });
          }
        }
        break;
      case "down":
        {
          const coordinate = getXY(data.index);
          if (coordinate.y != 3) {
            setData({
              ...data,
              index: data.index + 3,
              steps: data.steps + 1,
              message: "",
            });
          } else {
            setData({ ...data, message: "Aşağıya gidemezsiniz" });
          }
        }
        break;

      default:
        break;
    }
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setData({ ...data, email: evt.target.value });
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();

    if (data.email) {
      let newpost = {
        x: getXY(data.index).x,
        y: getXY(data.index).y,
        steps: data.steps,
        email: data.email,
      };
      axios
        .post("http://localhost:9000/api/result", newpost)
        .then((response) => {
          setData({ ...data, email: "", message: response.data.message });
          setTimeout(() => setData(data), 4000);
        })
        .catch((err) =>
          setData({ ...data, message: err.response.data.message })
        );
    } else {
      setData({ ...data, message: "Ouch: email is required" });
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj(getXY(data.index))}</h3>
        <h3 id="steps">{data.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === data.index ? " active" : ""}`}
          >
            {idx === data.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{data.message}</h3>
      </div>
      <div id="keypad">
        <button
          id="left"
          onClick={(event) => {
            console.log("buradayım");
            sonrakiIndex(event.target.id);
          }}
        >
          SOL
        </button>
        <button
          id="up"
          onClick={(event) => {
            sonrakiIndex(event.target.id);
          }}
        >
          YUKARI
        </button>
        <button
          id="right"
          onClick={(event) => {
            sonrakiIndex(event.target.id);
          }}
        >
          SAĞ
        </button>
        <button
          id="down"
          onClick={(event) => {
            sonrakiIndex(event.target.id);
          }}
        >
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          onChange={onChange}
          value={data.email}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}