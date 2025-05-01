# Notes for Learning

## Imports

import { NextResponse } from 'next/server';
- What it is: a utility tool from Next.js used in API routing or middleware
- Purpose: it helps you construct and return HTTP responses in Next.js server-side functions
- Example: return NextResponse.json({ message: 'OK'}) - returns a json with the message OK

import fs from 'fs';
- What it is: a Node.js File System module
- Purpose: it helps to read and write files on the server
- Example: fs.readFileSync('data.json', 'utf-8') - reads data.json in utf-8

import path from 'path';
- What it is: Node.js Path Module
- Purpose: helps construct file paths without hardcoding strongs
- Example: path.join(process.cwd(), 'public', 'data.json') - 
    - process.cwd() returns the absolute path to the root of your project
    - Then it goes to 'public'
    - Then it goes to 'data.json'
    - You can keep daisy chaining these

import { GoogleGenerativeAI } from '@google/generative-ai';
- What it is: a class from Google Generative AI SDK
- Purpose: it allows us to interact with Google's Gemini model, creating a client and sending prompts
- Example: 
    - const genAI = new GoogleGenerativeAI(apiKey);
    - const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    - const result = await model.generateContent('Hello AI');

  import Script from 'next/script';
  - Imports Script from Next.js that optimizes 3rd party scripts like Google Analytics

## Typescript

Constant vs Let
- const just means it can't be reassigned 
- let means it can
- However, a const object can still be changed though.
    - so a const String can't be changed, but a const object can (so immutable types declared on const can't change)
    - but a let String can (so even an immutable type can change, but it still follows the same rules as java String vs StringBuilder)

## React
export const GoogleAnalytics = () => {
- A react component that injects Google Analytics script into the webpage
- = () => is the same as () apparently...
- Has some differences with .this idk

Header />
- how you load things in react, any component

## Other

menuData = JSON.stringify(JSON.parse(rawMenuData), null, 2);
- JSON.parse(rawMenuData) turns a JSON string --> JavaScript Object
- JSON.stringify(..., null, 2) converts a JavaScript object --> JSON string, adding 2 indentation
    - null is a placeholder for a replacer function
- So basically we're converting JSON into an object and then converting the object back to confide to some rules

any
- means you don't know or care what type it is, skip type checking, initalizing it later

Script
- Component to load from Google and Initializing the script

## Github Workflows / tests
- Have to add keys in the .github files and add it to secrets
- Should learn how to make tests and such

## Chatbot
- Read chatbot.md to know design process, etc.