import { GoogleGenAI } from "@google/genai";
import { Product, ProductCategory } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (name: string, category: ProductCategory): Promise<string> => {
  try {
    const prompt = `
      أنت مساعد تسويق ذكي لتطبيق "سوبر ماركت الشارقة".
      قم بكتابة وصف تسويقي قصير وجذاب باللغة العربية للمنتج التالي:
      اسم المنتج: ${name}
      القسم: ${category}
      
      الوصف يجب أن يكون مشجعاً للشراء، لا يتجاوز 30 كلمة، واستخدم إيموجي مناسب.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "وصف رائع قادم قريباً!";
  } catch (error) {
    console.error("Error generating description:", error);
    return "منتج عالي الجودة متوفر الآن في سوبر ماركت الشارقة.";
  }
};

export const chatWithStore = async (query: string, products: Product[]): Promise<{ text: string, productId?: string }> => {
  try {
    // create a lightweight context
    const productContext = products.map(p => 
      `ID: "${p.id}", Name: "${p.name}", Price: ${p.price}, Discount: ${p.discount || 0}%, Category: "${p.category}"`
    ).join('\n');

    const prompt = `
      You are a smart customer support bot for "Sharjah Supermarket" (سوبر ماركت الشارقة).
      User Query: "${query}"
      
      Available Products Database:
      ${productContext}
      
      Instructions:
      1. Answer the user in Arabic politely.
      2. If the user asks about a product available in the database, provide its details (price, discount) and suggest it.
      3. If the user asks for something not in the list, apologize politely.
      4. You must return a JSON object.
      
      Output Schema:
      {
        "text": "The response message in Arabic",
        "productId": "The ID of the product if found and relevant, otherwise null"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error in chatWithStore:", error);
    return { text: "عذراً، حدث خطأ في النظام الذكي. يرجى المحاولة لاحقاً.", productId: undefined };
  }
};