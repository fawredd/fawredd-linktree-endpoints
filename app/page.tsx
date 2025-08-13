import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="container mx-auto">
      <div className="m-4 relative">
      <div className="absolute inset-0 bg-black opacity-30 rounded-2xl"></div>
      <div className="mx-auto p-3 text-white">
        <h1 className="text-center mb-6">-Mediumnidad Terapéutica-</h1>
        <p className="text-justify">
          <p>Como en todas las actividades que realizo, el objetivo principal en  esta sesion es ofrecer sanación mediante un encuentro que se realiza entre 3 energías:</p> 
          <ul>
            <li className="bullet">La del consultante, la mía como canal, y la del ser que partió 🤍</li>
            <li>En las sesiones de mediumnidad abro un espacio seguro y amoroso para conectar con seres queridos que ya partieron, transmitiendo y validando sus mensajes y sensaciones. Es un encuentro sanador que trae mucha paz, comprensión y un profundo sentido de conexión, haciéndonos comprender que la energía es multimendional y por esto mismo su presencia no desaparece jamás.  🤍</li>
            <li>Para ➕ info Wpp o MD en <Instagram /></li>
          </ul>
        </p>
      </div>
    </div>
    </div>
  );
}
