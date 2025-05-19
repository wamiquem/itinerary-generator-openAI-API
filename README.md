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
