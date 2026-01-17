// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/* =========================================================
 * Campaign Factory
 * =========================================================
 */
contract CampaignFactory {
    address[] public deployedCampaigns;

    // Create a new campaign
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    // Get all deployed campaigns
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

/* =========================================================
 * Campaign
 * =========================================================
 */
contract Campaign {
    /* ========================
     * Request structure
     * ======================== */
    struct Request {
        bytes32 description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
    }

    /* ========================
     * State variables
     * ======================== */
    address public manager;
    uint public minimumContribution;
    uint public approversCount;

    mapping(address => bool) public approvers;
    Request[] public requests;
    mapping(uint => mapping(address => bool)) public approvals;

    /* ========================
     * Constructor
     * ======================== */
    constructor(uint minimum, address managerAddress) {
        manager = managerAddress;
        minimumContribution = minimum;
    }

    /* ========================
     * Modifiers
     * ======================== */
    modifier restricted() {
        require(msg.sender == manager, "Only manager allowed");
        _;
    }

    /* ========================
     * Contributions
     * ======================== */
    function contribute() public payable {
        require(msg.value >= minimumContribution, "Contribution too small");

        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    /* ========================
     * Requests
     * ======================== */
    function createRequest(
        bytes32 description,
        uint value,
        address payable recipient
    ) public restricted {
        requests.push(
            Request({
                description: description,
                value: value,
                recipient: recipient,
                complete: false,
                approvalCount: 0
            })
        );
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender], "Not an approver");
        require(!approvals[index][msg.sender], "Already voted");

        approvals[index][msg.sender] = true;
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage r = requests[index];

        require(!r.complete, "Already finalized");
        require(r.approvalCount > approversCount / 2, "Not enough approvals");

        (bool sent, ) = r.recipient.call{value: r.value}("");
        require(sent, "Transfer failed");

        r.complete = true;
    }

    /* ========================
     * View functions
     * ======================== */

    // Get summary info of the campaign
    function getCampaignDetails() public view returns (
        uint _minimumContribution,
        uint _balance,
        uint _requestsCount,
        uint _approversCount,
        address _manager
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

    // Get a single request
    function getRequest(uint index) public view returns (
        bytes32 description,
        uint value,
        address recipient,
        bool complete,
        uint approvalCount
    ) {
        Request storage r = requests[index];
        return (
            r.description,
            r.value,
            r.recipient,
            r.complete,
            r.approvalCount
        );
    }

}
