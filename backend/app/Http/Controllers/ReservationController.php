<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    // pengguna methods
    
    // submit new reservation request
    public function store(StoreReservationRequest $request)
    {
        //
    }

    // get list of logged in user's reservations
    public function myList(Request $request)
    {
        //
    }

    // get detail of a specific reservation
    public function show($id)
    {
        //
    }

    // cancel user's own pending/approved reservation
    public function cancel($id)
    {
        //
    }

    // petugas / admin methods

    // get list of pending reservation queue
    public function queue(Request $request)
    {
        //
    }

    // approve a pending reservation
    public function approve($id)
    {
        //
    }

    // reject a pending reservation
    public function reject($id, Request $request)
    {
        //
    }

    // force cancel an approved reservation with a reason
    public function forceCancel($id, Request $request)
    {
        //
    }
}