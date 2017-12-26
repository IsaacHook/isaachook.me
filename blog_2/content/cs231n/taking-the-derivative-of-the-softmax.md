+++
title = "Taking the derivative of the softmax function"
date = "2017-01-14T16:20:09+11:00"
toc = true
next = "/next/path"
prev = "/prev/path"
weight = 5

+++

The softmax funciton assumes that the scores received from a classifier are unnormalized
log probabilities.  The softmax function is:


\begin{align}
    L_0 = & \max(0, e^1_0 - w_0^Tx_0 + 1) + \max(0, w_2^Tx_0 - w_0^Tx_0 + 1) \\\\  
    L_1 = & \max(0, w_0^Tx_1 - w_1^Tx_1 + 1) + \max(0, w_2^Tx_1 - w_1^Tx_1 + 1) \\\\  
    L_2 = & \max(0, w_0^Tx_2 - w_2^Tx_2 + 1) + \max(0, w_1^Tx_2 - w_2^Tx_2 + 1) \\\\  
    L = & (L_0 + L_1 + L_2)/3
\end{align}

