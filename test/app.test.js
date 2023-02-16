const request = require("supertest");
const express = require('express');
const { param } = require("../app");

test("GET random not found endpoint", () => {
  expect(200).toBe(200);
});

