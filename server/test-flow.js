async function test() {
  const phone = '9172272519';
  console.log('--- Step 1: Reset user in PostgreSQL ---');
  const resetRes = await fetch('http://localhost:5000/api/user/reset-attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  }).then(r => r.json());
  console.log('Reset response:', resetRes.message);

  console.log('--- Step 2: Check initial user profile in PostgreSQL ---');
  let user = await fetch('http://localhost:5000/api/user/' + phone).then(r => r.json()).then(d => d.user);
  console.log('Initial user:', { phone: user.phone, free_attempts_left: user.free_attempts_left, is_payment_done: user.is_payment_done, selected_plan: user.selected_plan });

  console.log('--- Step 3: Unlock deed 1 (Attempt 1 of 3) ---');
  let res1 = await fetch('http://localhost:5000/api/user/unlock-deed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, transactionId: 'txn-101' })
  }).then(r => r.json());
  console.log('Unlock 1 result:', { unlocked: res1.unlocked, free_attempts_left: res1.free_attempts_left, method: res1.method });

  console.log('--- Step 4: Unlock deed 2 (Attempt 2 of 3) ---');
  let res2 = await fetch('http://localhost:5000/api/user/unlock-deed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, transactionId: 'txn-102' })
  }).then(r => r.json());
  console.log('Unlock 2 result:', { unlocked: res2.unlocked, free_attempts_left: res2.free_attempts_left, method: res2.method });

  console.log('--- Step 5: Unlock deed 3 (Attempt 3 of 3) ---');
  let res3 = await fetch('http://localhost:5000/api/user/unlock-deed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, transactionId: 'txn-103' })
  }).then(r => r.json());
  console.log('Unlock 3 result:', { unlocked: res3.unlocked, free_attempts_left: res3.free_attempts_left, method: res3.method });

  console.log('--- Step 6: Unlock deed 4 (Should be BLOCKED because free limit reached) ---');
  let res4 = await fetch('http://localhost:5000/api/user/unlock-deed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, transactionId: 'txn-104' })
  });
  let res4Data = await res4.json();
  console.log('Unlock 4 result (HTTP ' + res4.status + '):', { unlocked: res4Data.unlocked, limitReached: res4Data.limitReached, message: res4Data.message });

  console.log('--- Step 7: Select Plan investor in PostgreSQL (Payment Done = true) ---');
  let planRes = await fetch('http://localhost:5000/api/user/select-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, planId: 'investor', isPaymentDone: true })
  }).then(r => r.json());
  console.log('Plan selection result:', { success: planRes.success, selected_plan: planRes.user.selected_plan, is_payment_done: planRes.user.is_payment_done });

  console.log('--- Step 8: Unlock deed 4 now (Should SUCCEED under paid plan) ---');
  let res5 = await fetch('http://localhost:5000/api/user/unlock-deed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, transactionId: 'txn-104' })
  }).then(r => r.json());
  console.log('Unlock 4 with plan result:', { unlocked: res5.unlocked, method: res5.method, is_payment_done: res5.is_payment_done });

  console.log('--- Step 9: Reset back to 3 free attempts so user can start fresh ---');
  await fetch('http://localhost:5000/api/user/reset-attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  console.log('End-to-end verification complete!');
}
test();
