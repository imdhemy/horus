// ----------------------------------------------------------------------------
// Instructions
// ----------------------------------------------------------------------------
//
// The 6502 has 56 official instructions, each conventionally referred to
// by a 3-letter mnemonic (LDA, STA, JMP, etc.). Most instructions support
// several addressing modes, so one mnemonic usually maps to several opcode
// bytes — which is why OPCODE_TABLE in opcode-table.js has multiple entries per
// mnemonic (e.g. LDA has eight, one for each addressing mode it supports).
//
// Each INS_* here is an internal identifier used as the `case` label in
// the execute switch in CPU.emulate() in ../cpu.js. The numeric values are
// arbitrary but must stay in sync with that switch.
//
// NOTE: the NES's 2A03/2A07 CPU omits the 6502's BCD (binary-coded decimal)
// mode. The CLD / SED instructions still exist and toggle the D flag, but
// the D flag has no effect on ADC/SBC. That's why the CLD/SED handlers in
// emulate() look like no-ops aside from flipping the flag.
//
// See https://www.nesdev.org/wiki/CPU for a per-instruction reference.

// Arithmetic & logic
export const INS_ADC = 0; //  ADC — Add memory to accumulator with carry
export const INS_AND = 1; //  AND — Bitwise AND memory with accumulator
export const INS_ASL = 2; //  ASL — Arithmetic shift left (top bit → carry)
// Branches — each tests one status flag and jumps relative to PC if it matches
export const INS_BCC = 3; //  BCC — Branch if carry clear
export const INS_BCS = 4; //  BCS — Branch if carry set
export const INS_BEQ = 5; //  BEQ — Branch if equal (zero flag set)
export const INS_BIT = 6; //  BIT — Bit test: N ← M.7, V ← M.6, Z ← (A & M) == 0
export const INS_BMI = 7; //  BMI — Branch if minus (negative flag set)
export const INS_BNE = 8; //  BNE — Branch if not equal (zero flag clear)
export const INS_BPL = 9; //  BPL — Branch if plus (negative flag clear)
export const INS_BRK = 10; // BRK — Software interrupt (pushes PC+2 and status, jumps via $FFFE)
export const INS_BVC = 11; // BVC — Branch if overflow clear
export const INS_BVS = 12; // BVS — Branch if overflow set
// Flag clears
export const INS_CLC = 13; // CLC — Clear carry flag
export const INS_CLD = 14; // CLD — Clear decimal flag (no effect on NES, see note above)
export const INS_CLI = 15; // CLI — Clear interrupt disable flag
export const INS_CLV = 16; // CLV — Clear overflow flag
// Compares — like subtract, but only set flags (don't modify the register)
export const INS_CMP = 17; // CMP — Compare memory with accumulator
export const INS_CPX = 18; // CPX — Compare memory with X
export const INS_CPY = 19; // CPY — Compare memory with Y
// Decrements
export const INS_DEC = 20; // DEC — Decrement memory by one
export const INS_DEX = 21; // DEX — Decrement X by one
export const INS_DEY = 22; // DEY — Decrement Y by one
// XOR
export const INS_EOR = 23; // EOR — Bitwise exclusive-OR memory with accumulator
// Increments
export const INS_INC = 24; // INC — Increment memory by one
export const INS_INX = 25; // INX — Increment X by one
export const INS_INY = 26; // INY — Increment Y by one
// Jumps
export const INS_JMP = 27; // JMP — Unconditional jump
export const INS_JSR = 28; // JSR — Jump to subroutine (pushes return address first)
// Loads
export const INS_LDA = 29; // LDA — Load accumulator from memory
export const INS_LDX = 30; // LDX — Load X from memory
export const INS_LDY = 31; // LDY — Load Y from memory
// Shift
export const INS_LSR = 32; // LSR — Logical shift right (bottom bit → carry)
// No-op
export const INS_NOP = 33; // NOP — No operation
// OR
export const INS_ORA = 34; // ORA — Bitwise OR memory with accumulator
// Stack pushes/pulls ("pull" is the 6502 term for "pop")
export const INS_PHA = 35; // PHA — Push accumulator onto stack
export const INS_PHP = 36; // PHP — Push processor status onto stack
export const INS_PLA = 37; // PLA — Pull accumulator from stack
export const INS_PLP = 38; // PLP — Pull processor status from stack
// Rotates (through carry)
export const INS_ROL = 39; // ROL — Rotate left through carry (C → bit 0, bit 7 → C)
export const INS_ROR = 40; // ROR — Rotate right through carry (C → bit 7, bit 0 → C)
// Returns
export const INS_RTI = 41; // RTI — Return from interrupt (pulls status and PC)
export const INS_RTS = 42; // RTS — Return from subroutine (pulls PC)
// Subtract
export const INS_SBC = 43; // SBC — Subtract memory from accumulator with borrow
// Flag sets
export const INS_SEC = 44; // SEC — Set carry flag
export const INS_SED = 45; // SED — Set decimal flag (no effect on NES, see note above)
export const INS_SEI = 46; // SEI — Set interrupt disable flag
// Stores
export const INS_STA = 47; // STA — Store accumulator to memory
export const INS_STX = 48; // STX — Store X to memory
export const INS_STY = 49; // STY — Store Y to memory
// Register transfers
export const INS_TAX = 50; // TAX — Transfer accumulator to X
export const INS_TAY = 51; // TAY — Transfer accumulator to Y
export const INS_TSX = 52; // TSX — Transfer stack pointer to X
export const INS_TXA = 53; // TXA — Transfer X to accumulator
export const INS_TXS = 54; // TXS — Transfer X to stack pointer
export const INS_TYA = 55; // TYA — Transfer Y to accumulator

// ----------------------------------------------------------------------------
// Unofficial opcodes
// ----------------------------------------------------------------------------
//
// The 6502's instruction decoder is a combinational circuit rather than a
// lookup table, and about 80 of the 256 possible opcode bytes decode to
// instructions that weren't part of the official instruction set but still
// do *something* — usually a combination of two official instructions that
// happen to share hardware (e.g. SLO = "ASL then ORA"). Some shipped NES
// games, and most CPU test ROMs (including nestest and AccuracyCoin), use
// them deliberately, so a correct NES emulator has to implement them.
//
// See https://www.nesdev.org/wiki/Programming_with_unofficial_opcodes

// Combined arithmetic/logic on the accumulator (immediate operand only)
export const INS_ALR = 56; // ALR (ASR) — AND then LSR:  A = (A & #imm) >> 1
export const INS_ANC = 57; // ANC        — AND, but also copy result's bit 7 into carry
export const INS_ARR = 58; // ARR        — AND then ROR, with peculiar N/V/C side effects
export const INS_AXS = 59; // AXS (SBX)  — X = (A & X) - #imm (like CMP, but stores result)
// Combined load/store
export const INS_LAX = 60; // LAX — Load A and X from memory simultaneously
export const INS_SAX = 61; // SAX — Store (A & X) to memory
// Read-modify-write combos: each does an RMW on memory then an A-side op
export const INS_DCP = 62; // DCP — DEC memory then CMP with A
export const INS_ISC = 63; // ISC (ISB) — INC memory then SBC from A
export const INS_RLA = 64; // RLA — ROL memory then AND with A
export const INS_RRA = 65; // RRA — ROR memory then ADC with A
export const INS_SLO = 66; // SLO — ASL memory then ORA with A
export const INS_SRE = 67; // SRE — LSR memory then EOR with A
// Multi-byte NOPs. These consume extra bytes and (for IGN) still perform a
// dummy memory read, but don't otherwise affect state. Games occasionally
// use them for precise cycle-count padding.
export const INS_SKB = 68; // SKB — 2-byte NOP (skips an immediate byte)
export const INS_IGN = 69; // IGN — 3-byte NOP that still reads from memory

// "Unstable" opcodes whose output depends on the internal bus arbitration
// between CPU cycles. Most store (register & (high byte of target + 1)).
// The DMC audio channel's DMA transfer can hijack the bus mid-instruction
// and change the stored value — the emulator handles this interaction in
// the execute switch. Essentially no shipped games use these, but the
// AccuracyCoin test ROM does.
export const INS_SHA = 71; // SHA (AHX) — Store A & X & (H+1)
export const INS_SHS = 72; // SHS (TAS) — SP = A & X, then store SP & (H+1)
export const INS_SHY = 73; // SHY (SYA) — Store Y & (H+1)
export const INS_SHX = 74; // SHX (SXA) — Store X & (H+1)
export const INS_LAE = 75; // LAE (LAS) — A = X = SP = (memory & SP)

// Opcodes whose behavior depends on a "magic" constant that varies between
// CPU manufacturing runs (and even across die temperature). Tests only
// exercise these with inputs (A = $FF, or immediate = $00) where the magic
// value cancels out of the result, so we can pick any reasonable magic.
export const INS_ANE = 76; // ANE (XAA) — A = (A | magic) & X & #imm
export const INS_LXA = 77; // LXA (ATX) — A = X = (A | magic) & #imm
