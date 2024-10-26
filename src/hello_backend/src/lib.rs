use candid::Principal;
use ic_cdk::api;
use ic_cdk_macros::{query, update};

#[query]
async fn greet(name: String) -> String {
    format!("Hello, {}", name)
}

/// Get a random float32 number in [0, 1).
#[update]
async fn get_random_float() -> f32 {
    // Request certified randomness from the IC
    let (random_bytes,): (Vec<u8>,) = api::call::call(
        Principal::management_canister(),
        "raw_rand",
        ()
    ).await.expect("Failed to get randomness");

    // Ensure the byte vector is long enough and convert it to an array
    let random_array: [u8; 4] = random_bytes[..4].try_into().expect("Slice with incorrect length");
    let random = u32::from_be_bytes(random_array);
    random as f32 / u32::MAX as f32
}

/// Get a random choice from the set {0, 1, 2}.
#[update]
async fn get_random_choice() -> u8 {
    // Request certified randomness from the IC
    let (random_bytes,): (Vec<u8>,) = api::call::call(
        Principal::management_canister(),
        "raw_rand",
        ()
    ).await.expect("Failed to get randomness");

    // Ensure the byte vector is long enough and convert the first byte to a value between 0 and 2
    let random_byte = random_bytes[0];
    let choice = random_byte % 3; // This will give a value in {0, 1, 2}

    choice
}
