// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/* =========================================================
 * Campaign Factory
 * =========================================================
 */
contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(
            new Campaign(minimum, msg.sender)
        );
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns()
        public
        view
        returns (address[] memory)
    {
        return deployedCampaigns;
    }
}

/* =========================================================
 * Campaign
 * =========================================================
 */
contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    uint public approversCount;

    mapping(address => bool) public approvers;
    Request[] public requests;

    constructor(uint minimum, address managerAddress) {
        manager = managerAddress;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only manager allowed");
        _;
    }

    function contribute() public payable {
        require(
            msg.value >= minimumContribution,
            "Contribution too small"
        );

        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(
        string calldata description,
        uint value,
        address payable recipient
    ) public restricted {
        Request storage r = requests.push();
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender], "Not an approver");

        Request storage myRequest = requests[index];

        require(
            !myRequest.approvals[msg.sender],
            "Already voted"
        );

        myRequest.approvals[msg.sender] = true;
        myRequest.approvalCount++;
    }

    function finalizeRequest(uint index)
        public
        restricted
    {
        Request storage myRequest = requests[index];

        require(!myRequest.complete, "Already finalized");
        require(
            myRequest.approvalCount > approversCount / 2,
            "Not enough approvals"
        );

        myRequest.recipient.transfer(myRequest.value);
        myRequest.complete = true;
    }
}
