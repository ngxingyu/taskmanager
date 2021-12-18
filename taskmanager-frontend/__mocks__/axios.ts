import axios from "axios";

const fs = require("fs");

const mock = jest.fn(
  (url) =>
    new Promise((resolve, reject) => {
      fs.readFile(
        `./__mockData__${url}.json`,
        "utf8",
        (err: any, data: string) => {
          if (err) {
            reject(err);
          }
          resolve(JSON.parse(data));
        }
      );
    })
);

export default {
  get: mock,
  post: mock,
  create: jest.fn(function () {
    return axios;
  }),
};
