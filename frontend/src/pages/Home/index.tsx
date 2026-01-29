import { Item } from "../../components/Item";

export function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Item
        typeAnimal="cat"
        petName={"Simba Farias"}
        ownerName={"Emmanuel Farias"}
        petRace={"Persa"}
        ownerTelefone={"81982402134"}
        petDateOfBirth={new Date(Date.now())}
      />
    </div>
  );
}
