import Logo from "@/components/Logo";
import RaceTrack from "@/components/RaceTrack";

const racers = [
  { name: "大坂龍平", progress: 82, car: "🏎️" },
  { name: "田中", progress: 61, car: "🚗" },
  { name: "佐藤", progress: 47, car: "🚙" },
  { name: "鈴木", progress: 25, car: "🚕" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-10">
      <Logo />

      <div className="mt-12 max-w-4xl mx-auto">
        <RaceTrack racers={racers} />
      </div>
    </main>
  );
}