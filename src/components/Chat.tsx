import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Message {
  role: "user" | "assistant";
  text: string;
  image?: string;
}

const CHAT_URL = "https://functions.poehali.dev/5e4f84be-e8c6-4c67-85d8-b42950937e6d";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Привет! Я Павлюк AI — задай мне любой вопрос или прикрепи фото, я помогу разобраться." }
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setImage(base64);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const send = async () => {
    if (!input.trim() && !image) return;
    const userMsg: Message = { role: "user", text: input, image: imagePreview ?? undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
    setLoading(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, image: image ?? undefined })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply || "Что-то пошло не так, попробуй ещё раз." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Ошибка соединения. Попробуй ещё раз." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section id="contact" className="bg-neutral-950 min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl flex flex-col h-[70vh]">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-2">Попробуй прямо сейчас</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Павлюк AI</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-white text-black rounded-br-sm"
                  : "bg-neutral-800 text-white rounded-bl-sm"
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="uploaded" className="rounded-lg mb-2 max-h-48 object-cover w-full" />
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-neutral-800 text-white rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="relative w-16 h-16 mb-2">
            <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-neutral-700 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 items-end bg-neutral-900 border border-neutral-700 rounded-2xl px-4 py-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="text-neutral-400 hover:text-white transition-colors flex-shrink-0 mb-0.5"
            title="Прикрепить фото"
          >
            <Icon name="Paperclip" size={20} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Напиши вопрос или прикрепи фото..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-neutral-500 resize-none outline-none text-sm leading-relaxed max-h-32"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            onClick={send}
            disabled={loading || (!input.trim() && !image)}
            className="flex-shrink-0 bg-white text-black rounded-xl w-8 h-8 flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
          >
            <Icon name="ArrowUp" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
