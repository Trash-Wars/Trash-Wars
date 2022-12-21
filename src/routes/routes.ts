type Data = {
  name: string;
  score: number;
}

export const addScore = async (data: Data) => {
  try {
    await fetch("https://trash-wars-server.herokuapp.com/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
  }
};
