// ----------------------------------------------------------------------------
// Addressing modes
// ----------------------------------------------------------------------------
//
// The 6502 has 13 addressing modes — different ways of specifying where an
// instruction's operand lives. Some modes take a literal value, some read
// from a fixed memory address, some compute an address from a base plus an
// index register (X or Y), and some dereference a pointer stored in memory.
//
// The numeric values here are used as `case` labels in the addressing-mode
// switch at the top of emulate(), which computes the final effective
// address (or loads the literal value) for each instruction before the
// instruction itself runs. The code in that switch is the authoritative
// source for what each mode actually does on the bus, including the
// sometimes-tricky "dummy reads" the real 6502 performs on indexed modes.
//
// Notation below: $XX means a 1-byte value (0-$FF), $XXXX means a 2-byte
// value (0-$FFFF). "Zero page" is the first 256 bytes of memory ($0000-
// $00FF), which the 6502 can address with a single byte — giving faster
// and smaller code than full 16-bit addresses.
//
// See https://www.nesdev.org/wiki/CPU_addressing_modes

export const ADDR_ZP = 0; //          Zero page         — operand at $00XX
export const ADDR_REL = 1; //         Relative          — PC + signed 8-bit offset (branches)
export const ADDR_IMP = 2; //         Implied           — no operand (e.g. CLC, RTS, TAX)
export const ADDR_ABS = 3; //         Absolute          — operand at $XXXX (any address)
export const ADDR_ACC = 4; //         Accumulator       — operand is the A register itself
export const ADDR_IMM = 5; //         Immediate         — operand is a literal byte (LDA #$42)
export const ADDR_ZPX = 6; //         Zero page,X       — operand at ($XX + X) & $FF
export const ADDR_ZPY = 7; //         Zero page,Y       — operand at ($XX + Y) & $FF
export const ADDR_ABSX = 8; //        Absolute,X        — operand at $XXXX + X
export const ADDR_ABSY = 9; //        Absolute,Y        — operand at $XXXX + Y
export const ADDR_PREIDXIND = 10; //  (Indirect,X)      — pointer at ($XX + X) in zero page
export const ADDR_POSTIDXIND = 11; // (Indirect),Y      — pointer at $XX in zero page, then + Y
export const ADDR_INDABS = 12; //     Indirect absolute — pointer at $XXXX (JMP indirect only)
