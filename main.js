// AXIOS GLOBALS
axios.defaults.headers.common["Authorization"] =
  "real_token_from_local_storage";

// GET REQUEST
function getTodos() {
  // short version
  axios
    .get(`https://jsonplaceholder.typicode.com/todos?_limit=5`, {
      timeout: 90000
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));

  // full version
  //   axios({
  //     method: "get",
  //     url: "https://jsonplaceholder.typicode.com/todos",
  //     // equal to https://jsonplaceholder.typicode.com/todos?_limit=5
  //     params: {
  //       _limit: 5,
  //     },
  //     timeout: 5,
  //   })
  //     .then((res) => {
  //       console.log(res.status);
  //       console.log(res.headers);
  //       console.log(res.config);
  //       showOutput(res);
  //     })
  //     .catch((error) => console.log(error));
}

// POST REQUEST
const data = {
  userId: 1,
  title: "my todo",
  completed: false,
};
function addTodo() {
  axios
    .post("https://jsonplaceholder.typicode.com/todos", data)
    .then((response) => {
      showOutput(response);
    });
  //   axios({
  //     method: "post",
  //     url: "https://jsonplaceholder.typicode.com/todos",
  //     data,
  //   }).then((response) => {
  //     console.log(response);
  //     showOutput(response);
  //   });
}

// PUT/PATCH REQUEST, put - replace a object. patch - edit object

function updateTodo() {
  axios
    .patch("https://jsonplaceholder.typicode.com/todos/1", {
      title: "finish todo",
      completed: true,
    })
    .then((response) => showOutput(response))
    .catch((error) => console.log(error));
}

// DELETE REQUEST
function removeTodo() {
  axios
    .delete("https://jsonplaceholder.typicode.com/todos/2")
    .then((response) => showOutput(response))
    .catch((error) => console.log(error));
}

// Multiple Request
let arrUrls = [
  "https://jsonplaceholder.typicode.com/todos?_limit=5",
  "https://jsonplaceholder.typicode.com/posts?_limit=5",
];
// OPTION 1
function getData() {
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
      axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
    ])
    .then(
      axios.spread((todos, posts) => {
        console.log(todos, posts);
        showOutput(todos);
      })
    );
}
// OPTION 2
function getData() {
  axios.all(arrUrls.map((item) => axios.get(item))).then(
    axios.spread((...data) => {
      console.log(data);
      showOutput(data[0]);
    })
  );
}

// CUSTOM HEADERS
function customHeaders() {
  const data = {
    userId: 1,
    title: "my todo",
    completed: false,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .post("https://jsonplaceholder.typicode.com/todos", data, config)
    .then((response) => showOutput(response))
    .catch((error) => console.log(error));
}

// TRANSFORMING REQUESTS & RESPONSES
// add custom data to response
function transformResponse() {
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "new title",
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title + " addition data to title response";
      return data;
    }),
  };
  axios(options)
    .then((response) => showOutput(response))
    .catch((error) => console.log(error));
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get("https://jsonplaceholder.typicode.com/todo!s", {
      validateStatus: (status) => {
        return status < 500; // thor error in catch if status > 500,if not catch not activated
      },
    })
    .then((response) => showOutput(response))
    .catch((error) => {
      console.log(error.response);
      console.log(error.response.status);
      console.log(error.response.statusText || "No Status text");
      console.log(error.response.headers);
      console.log(error.request);
      console.log(error.message);
      if (error.response.status === 404) {
        alert("Page not found");
      }
    });
}

// CANCEL TOKEN
function cancelToken() { }

// AXIOS INSTANCE

const axiosIncstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

axiosIncstance.get("/comments").then((response) => showOutput(response));

// Intercepting, log request
axios.interceptors.request.use((config) => {
  console.log(`${config.method.toUpperCase()},  send to ${config.url}`);
  return config;
});

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
