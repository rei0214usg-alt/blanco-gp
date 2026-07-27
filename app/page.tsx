import Logo from "@/components/Logo";
import RaceTrack from "@/components/RaceTrack";

const racers = [
  {
    id: "ryuhei",
    name: "大坂龍平",
    progress: 82,
    car: "🏎️",
  },
  {
    id: "tanaka",
    name: "田中",
    progress: 61,
    car: "🚗",
  },
  {
    id: "sato",
    name: "佐藤",
    progress: 47,
    car: "🚙",
  },
  {
    id: "suzuki",
    name: "鈴木",
    progress: 29,
    car: "🏁",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-900">
      <Logo />

      <div className="mt-12">
        <RaceTrack racers={racers} />
      </div>
    </main>
  );
}