function GetAction (Dx: number, Dy: number, Loop: number) {
    MoveAndLoop(Dx, Dy, Loop)
    NewBlock()
    TheGameplayIsOver()
}
spriteutils.createRenderable(0, function (screen2) {
    RenderGrid(screen2)
    if (BlackAndWhite) {
        screen2.replace(15, 3)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    BlackAndWhite = !(BlackAndWhite)
})
function TheGameplayIsOver () {
    GameOver = true
    for (let index = 0; index <= Gwidth * Gheight - 1; index++) {
        if (Grid[index] > 0) {
            FindLastChange(index, 1, 0)
            FindLastChange(index, -1, 0)
            FindLastChange(index, 0, 1)
            FindLastChange(index, 0, -1)
        } else if (Grid[index] == 0) {
            GameOver = false
        }
    }
    if (GameOver) {
        game.gameOver(false)
    }
}
function RenderGrid (Src: Image) {
    for (let index = 0; index <= Gwidth * Gheight - 1; index++) {
        if (Grid[index] > 0) {
            RenderTile(Src, index, -1)
        }
    }
}
function MoveAndLoop (Dx: number, Dy: number, Loop: number) {
    for (let index = 0; index < Loop; index++) {
        MoveToMerge(Dx, Dy)
    }
}
function MoveToMerge (Dx: number, Dy: number) {
    for (let index = 0; index <= Gwidth * Gheight - 1; index++) {
        TowardI = ScanInDirection(Dx, Dy, index)
        if (Grid[TowardI] > 0) {
            I = TowardI
            Tile = Grid[TowardI]
            Grid[TowardI] = 0
            while (Grid[I] == 0) {
                I += Dx
                I += Dy * Gwidth
            }
            if (Grid[I] < 0 || Grid[I] != Tile) {
                I += 0 - Dx
                I += 0 - Dy * Gwidth
            }
            if (Grid[I] <= 0) {
                Grid[I] = Tile
            } else if (Grid[I] == Tile) {
                Grid[I] = Tile + 1
            }
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    GetAction(1, 0, 1)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    GetAction(0, 1, 1)
})
function RenderTile (Src: Image, Idx: number, Gap: number) {
    Gy = OffsetY * 16
    Gy += Math.floor(Idx / Gwidth) * 16
    Gx = OffsetX * 16
    Gx += Idx % Gwidth * 16
    Img = BlockTileList[Grid[Idx] + Gap].clone()
    if (!(BlackAndWhite)) {
        Img.replace(15, 2 + Math.floor((Grid[Idx] + Gap) / 2))
    }
    spriteutils.drawTransparentImage(Img, Src, Gx, Gy)
}
function SetGridList (OffX: number, OffY: number, Width: number, Height: number) {
    Gwidth = Width + 2
    Gheight = Height + 2
    OffsetX = OffX
    OffsetY = OffY
    Grid = []
    for (let index = 0; index < Gwidth; index++) {
        Grid.push(-1)
    }
    for (let index = 0; index < Gheight - 2; index++) {
        Grid.push(-1)
        for (let index = 0; index < Gwidth - 2; index++) {
            Grid.push(0)
        }
        Grid.push(-1)
    }
}
function SetupBackGround () {
    BackgroundList = [
    [
    assets.tile`myTile1`,
    assets.tile`myTile2`,
    assets.tile`myTile3`,
    assets.tile`myTile4`,
    assets.tile`myTile5`,
    assets.tile`myTile6`,
    assets.tile`myTile7`,
    assets.tile`myTile8`
    ],
    [
    assets.tile`myTile9`,
    assets.tile`myTile10`,
    assets.tile`myTile11`,
    assets.tile`myTile12`,
    assets.tile`myTile13`,
    assets.tile`myTile14`,
    assets.tile`myTile15`,
    assets.tile`myTile16`
    ],
    [
    assets.tile`myTile17`,
    assets.tile`myTile18`,
    assets.tile`myTile19`,
    assets.tile`myTile20`,
    assets.tile`myTile21`,
    assets.tile`myTile22`,
    assets.tile`myTile23`,
    assets.tile`myTile24`
    ],
    [
    assets.tile`myTile25`,
    assets.tile`myTile26`,
    assets.tile`myTile27`,
    assets.tile`myTile28`,
    assets.tile`myTile28`,
    assets.tile`myTile30`,
    assets.tile`myTile31`,
    assets.tile`myTile32`
    ],
    [
    assets.tile`myTile33`,
    assets.tile`myTile34`,
    assets.tile`myTile35`,
    assets.tile`myTile36`,
    assets.tile`myTile37`,
    assets.tile`myTile38`,
    assets.tile`myTile39`,
    assets.tile`myTile40`
    ]
    ]
    TickBackGround = 0
}
function ScanInDirection (Dx: number, Dy: number, Idx: number) {
    if (Dy > 0) {
        TowardI = Gwidth * Gheight - 1 - Idx
    } else if (Dy < 0) {
        TowardI = Idx
    } else if (Dx < 0) {
        TowardI = Idx
        Gx = Math.floor(TowardI / Gheight)
        Gy = TowardI % Gheight
        TowardI = Gx
        TowardI += Gy * Gheight
    } else if (Dx > 0) {
        TowardI = Gwidth * Gheight - 1 - Idx
        Gx = Math.floor(TowardI / Gheight)
        Gy = TowardI % Gheight
        TowardI = Gx
        TowardI += Gy * Gheight
    }
    return TowardI
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    GetAction(-1, 0, 1)
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    GetAction(0, -1, 1)
})
function NewBlock () {
    while (true) {
        Gamount = 0
        for (let index = 0; index <= Gwidth * Gheight - 1; index++) {
            if (Math.abs(Grid[index]) > 0) {
                Gamount += 1
            } else if (Grid[index] == 0) {
                if (Math.percentChance(1)) {
                    Grid[index] = randint(1, 2)
                    return
                }
            }
        }
        if (Gamount >= Grid.length) {
            return
        }
    }
}
function FindLastChange (Idx: number, Dx: number, Dy: number) {
    EdgeI = Idx + Dx
    EdgeI += Dy * Gwidth
    if (Grid[Idx] == Grid[EdgeI]) {
        GameOver = false
    }
}
function SetupBlock () {
    BlockTileList = [
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f 1 1 f f f f f f 1 
        1 f f f f f 1 f f 1 f f f f f 1 
        1 f f f f f f f f 1 f f f f f 1 
        1 f f f f f f f 1 f f f f f f 1 
        1 f f f f f f 1 f f f f f f f 1 
        1 f f f f f 1 1 1 1 f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f 1 f f f f f 1 
        1 f f f f f f f 1 1 f f f f f 1 
        1 f f f f f f 1 f 1 f f f f f 1 
        1 f f f f f 1 f f 1 f f f f f 1 
        1 f f f f f 1 1 1 1 f f f f f 1 
        1 f f f f f f f f 1 f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f 1 1 f f f f f f 1 
        1 f f f f f 1 f f 1 f f f f f 1 
        1 f f f f f f 1 1 f f f f f f 1 
        1 f f f f f 1 f f 1 f f f f f 1 
        1 f f f f f 1 f f 1 f f f f f 1 
        1 f f f f f f 1 1 f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 f f f f f 1 1 f f f 1 
        1 f f 1 1 f f f f 1 f f 1 f f 1 
        1 f f f 1 f f f f 1 1 1 f f f 1 
        1 f f f 1 f f f f 1 f f 1 f f 1 
        1 f f f 1 f f f f 1 f f 1 f f 1 
        1 f f 1 1 1 f f f f 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f 1 1 f f f 1 
        1 f f 1 f f 1 f f 1 f f 1 f f 1 
        1 f f f f 1 f f f f f f 1 f f 1 
        1 f f f f f 1 f f f f 1 f f f 1 
        1 f f 1 f f 1 f f f 1 f f f f 1 
        1 f f f 1 1 f f f 1 1 1 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f f f 1 f f 1 
        1 f f 1 f f 1 f f f f 1 1 f f 1 
        1 f f 1 1 1 f f f f 1 f 1 f f 1 
        1 f f 1 f f 1 f f 1 f f 1 f f 1 
        1 f f 1 f f 1 f f 1 1 1 1 f f 1 
        1 f f f 1 1 f f f f f f 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 f f f f f 1 1 f f f 1 
        1 f f 1 1 f f f f 1 f f 1 f f 1 
        1 f f f 1 f f f f f f 1 f f f 1 
        1 f f f 1 f f f f f 1 f f f f 1 
        1 f f 1 1 1 f f f 1 1 1 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 f f f 1 1 f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 f f f 1 1 f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f 1 1 1 1 f f 1 
        1 f f 1 f f 1 f f 1 f f f f f 1 
        1 f f f f 1 f f f 1 1 1 f f f 1 
        1 f f f 1 f f f f f f f 1 f f 1 
        1 f f 1 1 1 1 f f 1 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 1 f f f f f f f f 1 
        1 f f 1 f f f f f f f f f f f 1 
        1 f f 1 1 1 f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 f f f 1 1 f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f 1 1 1 1 f f f 1 f f f f 1 
        1 f f 1 f f f f f 1 1 f f f f 1 
        1 f f 1 1 1 f f f f 1 f f f f 1 
        1 f f f f f 1 f f f 1 f f f f 1 
        1 f f 1 1 1 f f f 1 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 f f f f 1 f f f f f f f f f 1 
        1 f f f 1 f f f f f f f f f f 1 
        1 f f 1 1 1 1 f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 f f f f f 1 1 f f f 1 
        1 f f 1 1 f f f f 1 f f 1 f f 1 
        1 f f f 1 f f f f 1 f f 1 f f 1 
        1 f f f 1 f f f f 1 f f 1 f f 1 
        1 f f 1 1 1 f f f f 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f f 1 f f f 1 
        1 f f 1 f f 1 f f f 1 1 f f f 1 
        1 f f f f 1 f f f 1 f 1 f f f 1 
        1 f f f 1 f f f f 1 1 1 1 f f 1 
        1 f f 1 1 1 1 f f f f 1 f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f 1 1 f f f 1 
        1 f f 1 f f 1 f f 1 f f 1 f f 1 
        1 f f f f 1 f f f 1 f f 1 f f 1 
        1 f f f 1 f f f f 1 f f 1 f f 1 
        1 f f 1 1 1 1 f f f 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f 1 f f f f 1 1 f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 f f 1 f 1 f f f f 1 1 f f f 1 
        1 f f 1 1 1 1 f f 1 f f 1 f f 1 
        1 f f f f 1 f f f f 1 1 f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f 1 f f f f 1 1 f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 f f 1 f 1 f f f 1 f f 1 f f 1 
        1 f f 1 1 1 1 f f 1 f f 1 f f 1 
        1 f f f f 1 f f f f 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f 1 1 1 f f 1 
        1 f f 1 f f 1 f f 1 f f f f f 1 
        1 f f f 1 1 1 f f 1 1 1 f f f 1 
        1 f f f f f 1 f f 1 f f 1 f f 1 
        1 f f 1 1 1 f f f f 1 1 f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f 1 f f f f 1 
        1 f f 1 f f 1 f f 1 1 f f f f 1 
        1 f f f 1 1 f f f f 1 f f f f 1 
        1 f f 1 f f 1 f f f 1 f f f f 1 
        1 f f f 1 1 f f f 1 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f 1 1 f f f 1 
        1 f f 1 f f 1 f f 1 f f 1 f f 1 
        1 f f f 1 1 1 f f f f 1 f f f 1 
        1 f f f f f 1 f f f 1 f f f f 1 
        1 f f 1 1 1 f f f 1 1 1 1 f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 f f 1 f f 1 f f 1 f 1 f f f 1 
        1 f f f f f 1 f f 1 1 f f f f 1 
        1 f f f f 1 f f f 1 1 f f f f 1 
        1 f f f 1 f f f f 1 f 1 f f f 1 
        1 f f 1 1 1 1 f f 1 f f 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f 1 f f 1 f f 1 f f 1 
        1 f f f f 1 1 f f 1 f 1 f f f 1 
        1 f f f 1 f 1 f f 1 1 f f f f 1 
        1 f f 1 f f 1 f f 1 1 f f f f 1 
        1 f f 1 1 1 1 f f 1 f 1 f f f 1 
        1 f f f f f 1 f f 1 f f 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 f f 1 f f 1 f f 1 f 1 f f f 1 
        1 f f f 1 1 f f f 1 1 f f f f 1 
        1 f f 1 f f 1 f f 1 1 f f f f 1 
        1 f f 1 f f 1 f f 1 f 1 f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 f f f f f 1 1 1 f f 1 
        1 f f 1 1 f f f f 1 f f f f f 1 
        1 f f f 1 f f f f 1 1 1 f f f 1 
        1 f f f 1 f f f f 1 f f 1 f f 1 
        1 f f 1 1 1 f f f f 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 f f 1 f 1 f f f f f f f f f 1 
        1 f f 1 1 f f f f f f f f f f 1 
        1 f f 1 f 1 f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f f 1 1 f f f 1 
        1 f f 1 f f 1 f f 1 f f 1 f f 1 
        1 f f f f 1 f f f f f 1 f f f 1 
        1 f f 1 f f 1 f f f 1 f f f f 1 
        1 f f f 1 1 f f f 1 1 1 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 f f 1 f 1 f f f f f f f f f 1 
        1 f f 1 1 f f f f f f f f f f 1 
        1 f f 1 f 1 f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 1 f f f f 1 f f f 1 
        1 f f 1 f f f f f f 1 1 f f f 1 
        1 f f 1 1 1 f f f 1 f 1 f f f 1 
        1 f f 1 f f 1 f f 1 1 1 1 f f 1 
        1 f f f 1 1 f f f f f 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 f f 1 f 1 f f f f f f f f f 1 
        1 f f 1 1 f f f f f f f f f f 1 
        1 f f 1 f 1 f f f f f f f f f 1 
        1 f f 1 f f 1 f f f f f f f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 f f f f f 1 1 f f f 1 
        1 f f 1 1 f f f f 1 f f 1 f f 1 
        1 f f f 1 f f f f f f 1 f f f 1 
        1 f f f 1 f f f f f 1 f f f f 1 
        1 f f 1 1 1 f f f 1 1 1 1 f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 f f 1 f f 1 f f 1 f 1 f f f 1 
        1 f f f 1 1 f f f 1 1 f f f f 1 
        1 f f 1 f f 1 f f 1 f 1 f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f 1 1 1 1 f f 1 
        1 f f 1 f f 1 f f 1 f f f f f 1 
        1 f f f f 1 f f f 1 1 1 f f f 1 
        1 f f f 1 f f f f f f f 1 f f 1 
        1 f f 1 1 1 1 f f 1 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 1 f f 1 f f 1 f f 1 
        1 f f 1 f f f f f 1 f 1 f f f 1 
        1 f f 1 1 1 f f f 1 1 f f f f 1 
        1 f f 1 f f 1 f f 1 f 1 f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `,
    img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        1 1 f f f f f f f f f f f f 1 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f 1 1 1 1 f f f 1 f f f f 1 
        1 f f 1 f f f f f 1 1 f f f f 1 
        1 f f 1 1 1 f f f f 1 f f f f 1 
        1 f f f f f 1 f f f 1 f f f f 1 
        1 f f 1 1 1 f f f 1 1 1 f f f 1 
        1 f f f f f f f f f f f f f f 1 
        1 f f f 1 1 f f f 1 f f 1 f f 1 
        1 f f 1 f f 1 f f 1 f 1 f f f 1 
        1 f f f f 1 f f f 1 1 f f f f 1 
        1 f f f 1 f f f f 1 f 1 f f f 1 
        1 f f 1 1 1 1 f f 1 f f 1 f f 1 
        1 1 f f f f f f f f f f f f 1 1 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        `
    ]
}
let TickFloor = 0
let TickBackList = 0
let EdgeI = 0
let Gamount = 0
let TickBackGround = 0
let BackgroundList: Image[][] = []
let BlockTileList: Image[] = []
let Img: Image = null
let OffsetX = 0
let Gx = 0
let OffsetY = 0
let Gy = 0
let Tile = 0
let I = 0
let TowardI = 0
let Grid: number[] = []
let Gheight = 0
let Gwidth = 0
let GameOver = false
let BlackAndWhite = false
BlackAndWhite = false
SetupBackGround()
SetupBlock()
tiles.loadMap(tiles.createMap(tilemap`level2`))
SetGridList(2, 1, 4, 4)
NewBlock()
game.onUpdateInterval(100, function () {
    TickBackList = TickBackGround % (BackgroundList.length * 8)
    TickFloor = Math.floor(TickBackGround / 8) % 5
    for (let value of tiles.getTilesByType(BackgroundList[TickFloor][TickBackList % 8])) {
        tiles.setTileAt(value, BackgroundList[Math.floor((TickBackGround + 1) / 8) % 5][(TickBackList + 1) % 8])
    }
    TickBackGround += 1
})
