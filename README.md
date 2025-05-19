# Travel Itinerary Generator
A full stack web application to generate travel itineraries for planning a perfect trip. The app is built using Next.js and TypeScript. It uses OpenAI API to generate itineraries and MongoDB for storing data.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Material UI
- **Backend:** Next.js API Routes
- **AI:** OpenAI GPT-4 model API
- **Database:** MongoDB Atlas + Mongoose
- **Hosting:** Vercel

## Features
- Generate itineraries by entering a travel related prompt
- Save itineraries if preferred
- View a list of saved itineraries prompts in the History
- View itinerary in the Modal
- Mark/unmark itineraries as Favorite
- Filter Favorites
- Search for saved itineraries by prompt or answer
- Inform user about issues by displaying proper messages

## Data Flow
- User enters a travel related prompt and click on the `Generate Itinerary` button
- The request is sent to the backend server which calls the OpenAI API with the entered prompt and displays the formatted itinerary.
- If user wishes user can click on the `Save Itinerary` button to save the itinerary to the history otherwise user can change the prompt and generate a new itinerary. The data is saved to the MongoDB.
- On the History page, user can View, Favorite, Filter and Search the itinerary.

## Setup Instructions
```
Note:
1. Next.js requires `Node.js v16.8.0` or higher and `npm`. npm comes with Node.js
2. You will need OPENAI_API_KEY and MONGODB_URI in order for the app to generate and save itinerary, else a proper error message will be shown.
```

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/klarity-take-home-project.git
cd klarity-take-home-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env.local as below:
```
OPENAI_API_KEY=your-openai-key
MONGODB_URI=your-mongo-uri
```

### 4. Start the development server
```
npm run dev
```
The local server will be started with the details about local URL, for instance:
```
▲ Next.js 15.3.2
   - Local:        http://localhost:3000
   - Network:      http://10.0.0.34:3000
   - Environments: .env.local
```
App is available at `http://localhost:3000`

## Architectural Overview

### 1. Frontend (React + MUI)
- Written in Next.js App Router and TypeScript
- Uses Material UI for UI layout and components
- Page Layout:
  - `<Navbar />`
  - `<ToolBar />` (for spacing)
  - children
    - `Generate` (SSR Page)
      - `<GenerateItinerary />` (Client Component)
        - `<Box />` (For displaying generated itinerary)
        - `<TextField />` (Text area input field to enter prompt)
        - `<Button />` (To Generate Itinerary)
        - `<Button />` (To Save Itinerary)
        - `<Alert />` (To display informational message if API error)
        - `<Dialog />` (To show Success Confirmation for Save Iitnerary)
     - `HistoryPage` (SSR Page)
       - `<History />` (Client Component)
         - `<Checkbox />` (To filter Favorites)
         - `<TextField />` (To search history by prompt or answer)
         - `<Alert />` (To display informational message if API error)
         - `<Itinerary />[]` (List of saved itineraries)
           -`<Card />` (For an itinerary)
             - `<CardContent />` (For displaying prompt)
             - `<CardActions />` (For Action buttons)
               - `<IconButton />` (To mark Favorite with `<Tooltip/>`)
               - `<IconButton />` (To View formatted itinerary with `<Tooltip/>`)
             - `<Alert />` (To display informational message if API error)
          - `<Modal />` (To display formatted itinerary)

### 2. Backend (API Routes)
- Next.js API routes (`app/api/...`)
  - `POST /api/generate`: Accepts `prompt` in the request body and calls OpenAI API to get the itinerary.
  - `POST /api/itineraries`: Accepts `prompt` and `generated itinerary` and saves the itinerary to MongoDB.
  - `GET /api/history`: Gets all the itineraries from the MongoDB
  - `PUT /api/itineraries/${id}/favorite`: id is the MongoDB id passed in param and also accepts a boolean in body. Updates the itinerary by changing `isFavorite`.
- MongoDB
  - Connected to MongoDB Atlas with Mongoose
  - ItineraryDocument schema:
    ```
    prompt: { type: String, required: true },
    itinerary: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    isFavorite: {type: Boolean, default: false}
    ```

### 3. LLM API (OpenAI) integration
- `POST /api/generate` internally uses the OpenAI API `https://api.openai.com/v1/chat/completions` based on GPT-4 model. Accepts `role` and `content (prompt)`

### 4. Error Handling
- Proper message is shown to the user if the prompt is not travel related
- Alerts with proper message is shown to the users for API errors.

## Future Improvements/Enhancements
- First thing I will do is add Unit tests for Component and API testing.
- I have created a util that compares the prompt with an array of keywords. If the prompt does not contain any of the keywords, a message is shown to the user. We can use OpenAI API to filter non-travel related prompts. This will give more control for the prompt and a better user experience. This will also ensure blocking more unnecssary calls to OpenAI API that will ensure less API usage and ultimately saving some money.
- Can have a hybrid prompt model which asks user for options like dates and cities.
- For now, I am calling backend APIs using fetch from multiple place. We can have a custom hook (eg: useFetchApi) and call reuse the same hook for better code readability.
- Can use material UI theming to provide dark mode and light mode options to users.
- Provide functionalities like delete individual itinerary data from the history. Also, provide option to clear history.
- Provide functionalities for Sorting based on created date.
- Provide functionalities like generating PDF and printing the itinerary.
- Tooltip placement and styling.
- Handling Error from a dedicated component by using APIContext. Also improving UI for error.
- Changing `Fetching...` text with a better UI.
- Success message for Mark/Unmark Favorite like Save Itinerary. We can have a common reusable Dialog component curated as per our need.
- Considerations for accessibility, for instance, use ARIA labels and tabIndex wherever needed.
- Cross browser compatibility
- Provide Login and Authentication functionalities. We will have to ensure we address any security vulnerability like XSRF.
- I have used nextjs boilerplate code's favicon.ico so the icon on the browser tab is the NextJs logo.

## Known Issues
- Disabled eslint for mongoose file — global as any.
- The history page at the back of the View Modal when opened is scrollable.
- There is some inconsistency with enclosing strings in the code (Somewhere it is ' and at other places its "). This is mostly because of suggestions by vscode editor.

### Some Edge Cases Considered
- The UX design is responsive. I have tested it on iPhone device screen size on Chrome. Most of related CSS styling is handled by Material UI.
- User should not be able to generate itinerary with empty or non-travel related prompts
- When API call is in progress, disable `Generate itinerary` and `Save itinerary` buttons which will disable duplicate API calls

## Disclaimer
- The mongoose library connection file is copy/pasted as it from internet source
- I have taken reference of next API routes structure and initial code from internet source
- Some of the material UI components are copy/pasted from the material UI site for faster development.
- The idea for the app and UX/UI and architecture is completelty mine.

## Screenshots
<img width="1099" alt="Screenshot 2025-05-19 at 2 23 48 PM" src="https://github.com/user-attachments/assets/5f57463b-12d3-4170-8989-a95c3eebe98f" />

<img width="1098" alt="Screenshot 2025-05-19 at 2 25 06 PM" src="https://github.com/user-attachments/assets/59c7f842-068e-4408-9147-4ce9f0ea05d7" />

<img width="960" alt="Screenshot 2025-05-19 at 2 26 02 PM" src="https://github.com/user-attachments/assets/9f9f6a2e-3f3c-4cf5-a16e-5987a7d7a8cf" />

<img width="961" alt="Screenshot 2025-05-19 at 2 26 30 PM" src="https://github.com/user-attachments/assets/ca9cf98a-e6ef-4e0b-acca-ca780676d8ee" />

<img width="961" alt="Screenshot 2025-05-19 at 2 26 50 PM" src="https://github.com/user-attachments/assets/0ebbfd3c-1961-4161-92a5-dedc806de4b6" />

<img width="959" alt="Screenshot 2025-05-19 at 2 27 19 PM" src="https://github.com/user-attachments/assets/fcd795ce-4153-4fa3-aa5c-0a88a73f73a3" />

<img width="961" alt="Screenshot 2025-05-19 at 2 27 42 PM" src="https://github.com/user-attachments/assets/705acd2c-cfc8-47f8-9daf-9d4675b861fd" />

<img width="960" alt="Screenshot 2025-05-19 at 2 28 05 PM" src="https://github.com/user-attachments/assets/b2dadf4b-8bcb-432b-a845-d34c317494f4" />

<img width="962" alt="Screenshot 2025-05-19 at 2 28 28 PM" src="https://github.com/user-attachments/assets/dab3951e-2d21-4df0-bc5e-955152716134" />

<img width="959" alt="Screenshot 2025-05-19 at 2 29 02 PM" src="https://github.com/user-attachments/assets/544db97a-92f6-462d-a3be-f74c43241dde" />

<img width="960" alt="Screenshot 2025-05-19 at 2 31 31 PM" src="https://github.com/user-attachments/assets/83816c11-130b-43d1-9b81-2fb1eafd2c13" />

<img width="963" alt="Screenshot 2025-05-19 at 2 30 51 PM" src="https://github.com/user-attachments/assets/dd7db829-b9ae-4778-861a-e9d4bfa34883" />

<img width="362" alt="Screenshot 2025-05-19 at 2 33 18 PM" src="https://github.com/user-attachments/assets/987ffe1c-3d89-40ff-a9ac-35ace729f4cb" />

<img width="362" alt="Screenshot 2025-05-19 at 2 33 38 PM" src="https://github.com/user-attachments/assets/d85cb70d-8c95-4acd-8e78-d478672869be" />
