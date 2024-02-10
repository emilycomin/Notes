import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

//interface para estruturar o conteúdo das novas notas
interface NewNoteCardProps {
  //onNoteCreated é a função do componente pai que contem um content(conteúdo)
  //void significa que a função não retorna nada.
  onNoteCreated: (content: string) => void;
}
//função de escopo global para ser usada em duas funções diferentes
let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  //função para abrir o editor para o usuário digitar
  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }
  //função para que quando o usuário apague o texto retorne a frase inicial
  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }
  //função para salvar o texto digitado
  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    //condição para não salvar notas em branco
    if (content === "") {
      return toast.error("Grave um aúdio ou digite um texto");
    }
    //função onNoteCreated de fato salvando o canteúdo digitado na card.
    onNoteCreated(content);
    setContent("");
    setShouldShowOnboarding(true);
    toast.success("Nota salva com sucesso!");
  }
  //função integrando a API e iniciando gravação
  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Navegador não compativel com a tecnologia de gravar áudio");
      return;
    }
    setIsRecording(true);
    setShouldShowOnboarding(false);
    const speechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new speechRecognitionAPI();

    speechRecognition.continuous = true;
    speechRecognition.lang = "pt-BR";
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      console.log(event.results);
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = () => {
      console.error(event);
    };
    speechRecognition.start();
  }
  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-1 flex-col bg-slate-700 text-left p-5 gap-3 hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400 space-y-6">
          Comece gravando uma nota em audio ou se preferir utilize apenas texto
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* overlay é pra fazer o fundo escuro */}
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:h-[60vh] md:max-w-[640px] flex flex-col md:rounded-md outline-none overflow-hidden bg-slate-700">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 ">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota{" "}
                  </button>{" "}
                  em audio ou se preferir{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChange}
                  value={content}
                ></textarea>
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando (clique para interromper)
              </button>
            ) : (
              <button
                onClick={handleSaveNote}
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota?
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
