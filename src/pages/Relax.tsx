import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";

type Tile = {
  id: string;
  color: string;
  x: number;
  y: number;
  matched: boolean;
};

const colors = [
  "hsl(180, 60%, 60%)", // teal
  "hsl(150, 60%, 60%)", // green
  "hsl(210, 60%, 60%)", // blue
  "hsl(270, 60%, 60%)", // purple
  "hsl(330, 60%, 60%)", // pink
];

const Relax = () => {
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);

  const initializeGrid = () => {
    const newGrid: Tile[][] = [];
    for (let y = 0; y < 8; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < 8; x++) {
        row.push({
          id: `${x}-${y}-${Date.now()}`,
          color: colors[Math.floor(Math.random() * colors.length)],
          x,
          y,
          matched: false,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setScore(0);
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const checkMatches = (currentGrid: Tile[][]): Tile[][] => {
    const newGrid = currentGrid.map(row => [...row]);
    let hasMatches = false;

    // Check horizontal matches
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 6; x++) {
        if (
          newGrid[y][x].color === newGrid[y][x + 1].color &&
          newGrid[y][x].color === newGrid[y][x + 2].color &&
          !newGrid[y][x].matched
        ) {
          newGrid[y][x].matched = true;
          newGrid[y][x + 1].matched = true;
          newGrid[y][x + 2].matched = true;
          hasMatches = true;
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 6; y++) {
        if (
          newGrid[y][x].color === newGrid[y + 1][x].color &&
          newGrid[y][x].color === newGrid[y + 2][x].color &&
          !newGrid[y][x].matched
        ) {
          newGrid[y][x].matched = true;
          newGrid[y + 1][x].matched = true;
          newGrid[y + 2][x].matched = true;
          hasMatches = true;
        }
      }
    }

    if (hasMatches) {
      setScore(prev => prev + 10);
    }

    return newGrid;
  };

  const removeMatched = (currentGrid: Tile[][]): Tile[][] => {
    const newGrid = currentGrid.map(row => [...row]);

    // Remove matched tiles and drop tiles down
    for (let x = 0; x < 8; x++) {
      let writePos = 7;
      for (let y = 7; y >= 0; y--) {
        if (!newGrid[y][x].matched) {
          if (writePos !== y) {
            newGrid[writePos][x] = { ...newGrid[y][x], y: writePos };
          }
          writePos--;
        }
      }

      // Fill empty spaces with new tiles
      for (let y = writePos; y >= 0; y--) {
        newGrid[y][x] = {
          id: `${x}-${y}-${Date.now()}-${Math.random()}`,
          color: colors[Math.floor(Math.random() * colors.length)],
          x,
          y,
          matched: false,
        };
      }
    }

    return newGrid;
  };

  const handleTileClick = (x: number, y: number) => {
    if (grid[y][x].matched) return;

    if (!selected) {
      setSelected({ x, y });
      return;
    }

    const dx = Math.abs(selected.x - x);
    const dy = Math.abs(selected.y - y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      // Valid adjacent swap
      const newGrid = grid.map(row => [...row]);
      const temp = newGrid[selected.y][selected.x];
      newGrid[selected.y][selected.x] = { ...newGrid[y][x], x: selected.x, y: selected.y };
      newGrid[y][x] = { ...temp, x, y };

      let gridWithMatches = checkMatches(newGrid);
      
      if (gridWithMatches.some(row => row.some(tile => tile.matched))) {
        setTimeout(() => {
          const clearedGrid = removeMatched(gridWithMatches);
          setGrid(clearedGrid);
          
          // Check for cascading matches
          setTimeout(() => {
            const cascadeMatches = checkMatches(clearedGrid);
            if (cascadeMatches.some(row => row.some(tile => tile.matched))) {
              setTimeout(() => {
                setGrid(removeMatched(cascadeMatches));
              }, 300);
            }
          }, 300);
        }, 400);
        setGrid(gridWithMatches);
      } else {
        // No match, swap back
        setGrid(newGrid);
        setTimeout(() => {
          setGrid(grid);
        }, 300);
      }
    }

    setSelected(null);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-accent" />
            <div>
              <h1 className="text-3xl font-semibold">Relaxamento</h1>
              <p className="text-muted-foreground text-sm">
                Match-3 minimalista para mindfulness
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{score}</div>
            <div className="text-xs text-muted-foreground">pontos</div>
          </div>
        </div>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Troque peças adjacentes para formar linhas de 3 ou mais
          </p>
          <Button variant="outline" size="sm" onClick={initializeGrid}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Novo Jogo
          </Button>
        </div>
      </Card>

      <div className="bg-card rounded-lg p-4 border">
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
          {grid.map((row, y) =>
            row.map((tile, x) => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(x, y)}
                className={`aspect-square rounded transition-all duration-300 ${
                  tile.matched ? "opacity-0 scale-50" : "opacity-100 scale-100"
                } ${
                  selected?.x === x && selected?.y === y
                    ? "ring-2 ring-accent ring-offset-2"
                    : ""
                } hover:scale-105 active:scale-95`}
                style={{
                  backgroundColor: tile.color,
                }}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Um momento de calma na sua rotina</p>
      </div>
    </div>
  );
};

export default Relax;
