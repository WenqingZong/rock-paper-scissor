use candid::Principal;
use ic_cdk::api;
use ic_cdk_macros::update;

#[update]
async fn greet(name: String) -> String {
    // Request certified randomness from the IC
    let (random_bytes,): (Vec<u8>,) = api::call::call(
        Principal::management_canister(),
        "raw_rand",
        ()
    ).await.expect("Failed to get randomness");

    // Ensure the byte vector is long enough and convert it to an array
    let random_array: [u8; 4] = random_bytes[..4].try_into().expect("Slice with incorrect length");
    let random = usize::from_be_bytes(random_array);

    format!("Hello, {}, and random number {}!", name, random)
}
