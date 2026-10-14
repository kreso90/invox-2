import argon2 from "argon2";

const opts: argon2.HashOptions = {
	type: argon2.argon2id,
	memoryCost: 65536,
	timeCost: 3,
	parallelism: 4,
	hashLength: 32,
};

export async function hashPassword(password: string) {
	return argon2.hash(password, opts);
}

export async function verifyPassword(data: { password: string; hash: string }) {
	const { password, hash } = data;
	return argon2.verify(hash, password);
}
