import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useMusicPlayer } from "../Context/MusicPlayerContext";

function SortableItem({ song, index, currentSong, playSong, removeFromQueue }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    justifyContent: "space-between",
    padding: "6px",
    borderRadius: "6px",
    opacity: currentSong?.id === song.id ? 0.5 : 1,
    background: "#111",
    marginBottom: "5px",
    color: "white",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span onClick={() => playSong(song)} style={{ cursor: "pointer" }}>
        {index + 1}. {song.title}
      </span>

      <button
        onClick={() => removeFromQueue(song.id)}
        style={{
          background: "transparent",
          border: "none",
          color: "red",
          cursor: "pointer",
        }}
      >
        ❌
      </button>
    </div>
  );
}

export default function Queue() {
  const { queue, setQueue, playSong, currentSong, removeFromQueue } =
    useMusicPlayer();

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = queue.findIndex((s) => s.id === active.id);
    const newIndex = queue.findIndex((s) => s.id === over.id);

    setQueue((items) => arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="queue-panel">
      <h4>Up Next</h4>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={queue.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {queue.map((song, index) => (
            <SortableItem
              key={song.id}
              song={song}
              index={index}
              currentSong={currentSong}
              playSong={playSong}
              removeFromQueue={removeFromQueue}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}