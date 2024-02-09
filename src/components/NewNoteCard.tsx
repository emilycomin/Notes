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

//
export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState("");
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
    if (content === "") {
      return toast.error("Grave um aúdio ou digite um texto");
    }
    //função onNoteCreated de fato salvando o canteúdo digitado na card.
    onNoteCreated(content);
    setContent("");
    setShouldShowOnboarding(true);
    toast.success("Nota salva com sucesso!");
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
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] max-w-[640px] flex flex-col rounded-md outline-none overflow-hidden bg-slate-700">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 ">
            <X className="size-5" />
          </Dialog.Close>
          <form onSubmit={handleSaveNote} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button className="font-medium text-lime-400 hover:underline">
                    gravando uma nota{" "}
                  </button>{" "}
                  em audio ou se preferir{" "}
                  <button
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

            <button
              type="submit"
              className="w-full bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium hover:bg-lime-500"
            >
              Salvar nota?
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
