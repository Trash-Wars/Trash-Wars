interface Data {
  name: string;
  score: number;
}

export const fetchScores = async () => {
  try {
    const response = await fetch(
      "https://trash-wars-server.herokuapp.com/api/scores"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const addScore = async (data: Data) => {
  try {
    await fetch("https://trash-wars-server.herokuapp.com/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Score added to db successfully.");
  } catch (error) {
    console.error(error);
  }
};
