import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom/client";
import { container } from "tsyringe";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import init from "./core/container";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import Tokens from "./bin/Tokens";

(async () => {
  await init();

  const client = container.resolve<ApolloClient<NormalizedCacheObject>>(
    Tokens.apolloClient
  );

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
})();

reportWebVitals();
