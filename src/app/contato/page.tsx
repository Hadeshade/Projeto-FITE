"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Description } from "@radix-ui/react-dialog"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { toast } from "sonner"

export default function paginaContato(){
    const [nome, setNome] = useState("")
    const [email,setEmail] = useState("")
    const [mensagem, setMensagem] = useState("");

    function handleSubmit(e: React.FormEvent){
        e.preventDefault()

        if(!nome || !email || !mensagem){
            toast.error("Preencha todos os campos")
            return;
        }
        
        toast.success("Formulário enviado!",{
            description: "Seus dados foram enviados com sucesso"
        })

        setNome("")
        setEmail("")
        setMensagem("")
        console.log("DEu certo")
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <div className="w-full max-w-lg rounded-2xl border p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Entre em Contato
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                rows={5}
                placeholder="Digite sua mensagem..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    );
}