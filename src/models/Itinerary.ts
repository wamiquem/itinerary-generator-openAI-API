import mongoose, {Schema, Document, Model} from "mongoose"
import { ItineraryType } from "@/utils/interface"

export interface ItineraryDocument extends ItineraryType, Document {}

const ItinerarySchema = new Schema<ItineraryDocument>({
  prompt: { type: String, required: true },
  itinerary: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  isFavorite: {type: Boolean, default: false}
})

const Itinerary: Model<ItineraryDocument> = mongoose.models.Itinerary || mongoose.model("Itinerary", ItinerarySchema)

export default Itinerary
